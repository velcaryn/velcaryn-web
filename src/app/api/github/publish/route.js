import { Octokit } from 'octokit';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';
import { getCatalog, getArchive } from '../../../../lib/catalogData';

const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== "admin@velcaryn.com") {
        return new Response(JSON.stringify({ error: "Unauthorized Gateway Access" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = await req.json();
        const { action, payload, commitMessage } = body;

        if (!process.env.GITHUB_API_TOKEN) {
            return new Response(JSON.stringify({ error: "GITHUB_API_TOKEN is not configured on this server." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const owner = 'velcaryn';
        const repo = 'velcaryn-web';
        const branch = 'main';

        // Read latest state via the shared data layer (prod: GitHub API, dev: local disk)
        let catalogData = await getCatalog();
        let archiveData = await getArchive();

        let imagesToPush = [];
        let modifiedFiles = ['catalog.json'];

        // --- 2. Apply state mutation ---
        if (action === 'UPDATE_PRODUCT') {
            const { product, imageContentBase64 } = payload;
            const existingIndex = catalogData.products.findIndex(p => p.id === product.id);
            
            if (existingIndex >= 0) {
                catalogData.products[existingIndex] = product;
            } else {
                catalogData.products.unshift(product);
            }

            const archiveIndex = archiveData.archived_products.findIndex(p => p.id === product.id);
            if (archiveIndex >= 0) {
                archiveData.archived_products.splice(archiveIndex, 1);
                modifiedFiles.push('archive.json');
            }

            if (imageContentBase64) {
                imagesToPush.push({ path: `public/${product.image}`, contentBase64: imageContentBase64 });
            }
        } else if (action === 'REORDER_CATALOG') {
            catalogData.products = payload.products;
        } else if (action === 'UPDATE_CATEGORIES') {
            catalogData.categories = payload.categories;
        } else if (action === 'ARCHIVE_PRODUCT') {
            const index = catalogData.products.findIndex(p => p.id === payload.productId);
            if (index >= 0) {
                const productToArchive = catalogData.products.splice(index, 1)[0];
                productToArchive.archivedAt = new Date().toISOString();
                archiveData.archived_products.unshift(productToArchive);
                modifiedFiles.push('archive.json');
            } else {
                return new Response(JSON.stringify({ error: "Product ID not found in live catalog" }), { status: 404 });
            }
        } else if (action === 'UNARCHIVE_PRODUCT') {
            const index = archiveData.archived_products.findIndex(p => p.id === payload.productId);
            if (index >= 0) {
                const productToRestore = archiveData.archived_products.splice(index, 1)[0];
                delete productToRestore.archivedAt;
                catalogData.products.unshift(productToRestore);
                modifiedFiles.push('archive.json');
            } else {
                return new Response(JSON.stringify({ error: "Product ID not found in archive" }), { status: 404 });
            }
        } else if (action === 'REMOVE_FROM_LIVE') {
            const index = catalogData.products.findIndex(p => p.id === payload.productId);
            if (index >= 0) {
                catalogData.products.splice(index, 1);
            } else {
                return new Response(JSON.stringify({ error: "Product ID not found in live catalog" }), { status: 404 });
            }
        } else if (action === 'DELETE_ARCHIVED_PRODUCTS') {
            const initialLength = archiveData.archived_products.length;
            archiveData.archived_products = archiveData.archived_products.filter(p => !payload.productIds.includes(p.id));
            if (archiveData.archived_products.length !== initialLength) {
                modifiedFiles.push('archive.json');
            } else {
                return new Response(JSON.stringify({ error: "No matching products found to delete" }), { status: 404 });
            }
        } else {
            return new Response(JSON.stringify({ error: "Invalid Action Descriptor" }), { status: 400 });
        }

        // --- 3. Write to local disk ONLY in development (Netlify is read-only) ---
        if (!IS_PROD) {
            const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
            const archivePath = path.join(process.cwd(), 'public', 'data', 'archive.json');
            fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');
            if (modifiedFiles.includes('archive.json')) {
                fs.writeFileSync(archivePath, JSON.stringify(archiveData, null, 2), 'utf8');
            }
            for (const img of imagesToPush) {
                const base64Data = img.contentBase64.replace(/^data:image\/\w+;base64,/, "");
                const imagePath = path.join(process.cwd(), img.path);
                const imageDir = path.dirname(imagePath);
                if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
                fs.writeFileSync(imagePath, base64Data, 'base64');
            }
            // In dev: skip the GitHub API commit entirely, just return success immediately
            return new Response(JSON.stringify({ success: true, local: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 4. Commit to GitHub (production only) ---
        const refRes = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
        const commitSha = refRes.data.object.sha;
        const commitRes = await octokit.rest.git.getCommit({ owner, repo, commit_sha: commitSha });
        const rootTreeSha = commitRes.data.tree.sha;

        const treeItems = [];

        if (modifiedFiles.includes('catalog.json')) {
            const blob = await octokit.rest.git.createBlob({ owner, repo, content: JSON.stringify(catalogData, null, 2), encoding: 'utf-8' });
            treeItems.push({ path: 'public/data/catalog.json', mode: '100644', type: 'blob', sha: blob.data.sha });
        }

        if (modifiedFiles.includes('archive.json')) {
            const blob = await octokit.rest.git.createBlob({ owner, repo, content: JSON.stringify(archiveData, null, 2), encoding: 'utf-8' });
            treeItems.push({ path: 'public/data/archive.json', mode: '100644', type: 'blob', sha: blob.data.sha });
        }

        for (const img of imagesToPush) {
            const base64Content = img.contentBase64.replace(/^data:image\/\w+;base64,/, "");
            const imgBlob = await octokit.rest.git.createBlob({ owner, repo, content: base64Content, encoding: 'base64' });
            treeItems.push({ path: img.path, mode: '100644', type: 'blob', sha: imgBlob.data.sha });
        }

        const treeRes = await octokit.rest.git.createTree({ owner, repo, tree: treeItems, base_tree: rootTreeSha });
        const newCommitRes = await octokit.rest.git.createCommit({
            owner, repo,
            message: commitMessage || 'Dashboard: Catalog configuration update',
            tree: treeRes.data.sha,
            parents: [commitSha]
        });
        await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: newCommitRes.data.sha });

        // Immediately purge Next.js page cache so the next visitor gets fresh data
        // without needing a hard refresh or waiting for a full Netlify rebuild
        revalidatePath('/', 'layout');        // public homepage
        revalidatePath('/catalog', 'page');   // public catalog
        revalidatePath('/dashboard', 'layout'); // entire dashboard subtree

        return new Response(JSON.stringify({ success: true, commitUrl: newCommitRes.data.html_url }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Dashboard GitHub Publish Pipeline Error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Internal API processing fault.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
