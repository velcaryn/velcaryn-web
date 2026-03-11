import { Octokit } from 'octokit';
import { unstable_noStore as noStore } from 'next/cache';
import CatalogManager from '../../components/dashboard/CatalogManager';

const IS_PROD = process.env.NODE_ENV === 'production';

// Force dynamic rendering — never serve a stale cached version of this page
export const dynamic = 'force-dynamic';

async function getCatalogData() {
    if (IS_PROD) {
        noStore(); // Opt out of all caching
        const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });
        const res = await octokit.rest.repos.getContent({
            owner: 'velcaryn', repo: 'velcaryn-web', path: 'public/data/catalog.json'
        });
        const content = Buffer.from(res.data.content, 'base64').toString('utf8');
        return JSON.parse(content);
    } else {
        const fs = require('fs');
        const path = require('path');
        const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
        return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    }
}

export default async function DashboardHome() {
    const catalogData = await getCatalogData();

    return (
        <div>
            <div className="dashboard-header">
                <h1>Current Catalog</h1>
                <p>Overview of the {catalogData.products.length} active products currently live on the main website. Adjust the order below to dictate the layout on the live site.</p>
            </div>

            <CatalogManager initialProducts={catalogData.products} categories={catalogData.categories} />
        </div>
    );
}
