/**
 * lib/catalogData.js
 * Central data access layer for catalog and archive JSON.
 * - In production (Netlify): always fetches live data from the GitHub API.
 * - In development (localhost): reads from local filesystem for instant feedback.
 *
 * This ensures no stale data is ever served in production without requiring
 * a full Netlify rebuild for data-only changes (saving build credits).
 */

const OWNER = 'velcaryn';
const REPO = 'velcaryn-web';
const BRANCH = 'main';

/**
 * Fetch a JSON file from GitHub and return its parsed contents.
 * Uses the GitHub REST API (requires GITHUB_API_TOKEN).
 */
async function fetchFromGitHub(filePath) {
    const token = process.env.GITHUB_API_TOKEN;
    if (!token) throw new Error(`GITHUB_API_TOKEN is not set. Cannot fetch ${filePath} from GitHub.`);

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        // Never cache this in Next.js — always fetch fresh from GitHub
        cache: 'no-store',
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`GitHub API error ${res.status} fetching ${filePath}`);
    }

    const json = await res.json();
    const content = Buffer.from(json.content, 'base64').toString('utf8');
    return JSON.parse(content);
}

/**
 * Read a JSON file from the local filesystem (development only).
 */
function readLocal(relativePath) {
    // Dynamic require so this doesn't break in edge runtimes
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) return null;
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Get the full catalog (products + categories).
 * Returns { products: [], categories: [] }.
 */
export async function getCatalog() {
    if (IS_PROD) {
        return (await fetchFromGitHub('public/data/catalog.json')) || { products: [], categories: [] };
    }
    return readLocal('public/data/catalog.json') || { products: [], categories: [] };
}

/**
 * Get the archive list.
 * Returns { archived_products: [] }.
 */
export async function getArchive() {
    if (IS_PROD) {
        return (await fetchFromGitHub('public/data/archive.json')) || { archived_products: [] };
    }
    return readLocal('public/data/archive.json') || { archived_products: [] };
}

/**
 * The public-facing data URL for the catalog JSON.
 * Used by client components (Catalog.js) — always returns live GitHub raw content in prod.
 * This is a NEXT_PUBLIC env var so it's available in the browser bundle.
 */
export const PUBLIC_CATALOG_URL =
    process.env.NEXT_PUBLIC_CATALOG_URL ||
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/public/data/catalog.json`;
