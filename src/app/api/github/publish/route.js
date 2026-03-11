import { Octokit } from 'octokit';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    
    // Strict generic validation - prevent any unauthenticated modifications
    if (!session || session.user?.email !== "admin@velcaryn.com") {
        return new Response(JSON.stringify({ error: "Unauthorized Gateway Access" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = await req.json();
        const { action, payload, commitMessage } = body;

        // 1. Read latest local state to prevent overriding race-conditions from stale clients
        const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
        let catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        
        const archivePath = path.join(process.cwd(), 'public', 'data', 'archive.json');
        let archiveData = fs.existsSync(archivePath) ? JSON.parse(fs.readFileSync(archivePath, 'utf8')) : { archived_products: [] };
        
        let imagesToPush = [];
        let modifiedFiles = ['catalog.json']; // Track which logical domains to commit

        // Apply state mutation based on action payload
        if (action === 'UPDATE_PRODUCT') {
            const { product, imageContentBase64 } = payload;
            const existingIndex = catalogData.products.findIndex(p => p.id === product.id);
            
            if (existingIndex >= 0) {
                catalogData.products[existingIndex] = product; // Update existing
            } else {
                catalogData.products.unshift(product); // Add new to top of catalog
            }

            // Immediately purge from archive if it was restored from there by a direct edit
            const archiveIndex = archiveData.archived_products.findIndex(p => p.id === product.id);
            if (archiveIndex >= 0) {
                archiveData.archived_products.splice(archiveIndex, 1);
                modifiedFiles.push('archive.json');
            }

            if (imageContentBase64) {
                imagesToPush.push({
                    path: `public/${product.image}`,
                    contentBase64: imageContentBase64
                });
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
                catalogData.products.splice(index, 1); // Only delete from live array, don't archive
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

        // 2. Immediately apply updates to local Next.js disk so localhost reflects changes instantly
        fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');
        if (modifiedFiles.includes('archive.json')) {
            fs.writeFileSync(archivePath, JSON.stringify(archiveData, null, 2), 'utf8');
        }

        for (const img of imagesToPush) {
            // Strip the base64 data URI header prefix before writing to binary filesystem
            const base64Data = img.contentBase64.replace(/^data:image\/\w+;base64,/, "");
            const imagePath = path.join(process.cwd(), img.path);
            
            // Ensure the nested directory structures (like /public/images/products) actually exist on disk first
            const imageDir = path.dirname(imagePath);
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }
            
            fs.writeFileSync(imagePath, base64Data, 'base64');
        }

        // 2. Fallback check for GitHub Token
        if (!process.env.GITHUB_API_TOKEN) {
            return new Response(JSON.stringify({ 
                success: true, 
                warning: "Changes saved locally to staging, but GITHUB_API_TOKEN is missing. Remote push skipped." 
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // 3. Authenticate generic REST GitHub Client
        const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });
        const owner = 'velcaryn';
        const repo = 'velcaryn-web';
        const branch = 'main';

        // A. Extract current commit SHA tree cursor
        const refRes = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
        const commitSha = refRes.data.object.sha;
        const commitRes = await octokit.rest.git.getCommit({ owner, repo, commit_sha: commitSha });
        const rootTreeSha = commitRes.data.tree.sha;

        // B. Generate Blobs for data modifications
        const treeItems = [];

        if (modifiedFiles.includes('catalog.json')) {
            const catalogBlobRes = await octokit.rest.git.createBlob({
                owner, repo,
                content: JSON.stringify(catalogData, null, 2),
                encoding: 'utf-8'
            });
            treeItems.push({
                path: 'public/data/catalog.json',
                mode: '100644',
                type: 'blob',
                sha: catalogBlobRes.data.sha
            });
        }

        if (modifiedFiles.includes('archive.json')) {
            const archiveBlobRes = await octokit.rest.git.createBlob({
                owner, repo,
                content: JSON.stringify(archiveData, null, 2),
                encoding: 'utf-8'
            });
            treeItems.push({
                path: 'public/data/archive.json',
                mode: '100644',
                type: 'blob',
                sha: archiveBlobRes.data.sha
            });
        }

        for (const img of images) {
            const base64Content = img.contentBase64.replace(/^data:image\/\w+;base64,/, "");
            const imgBlobRes = await octokit.rest.git.createBlob({
                owner, repo,
                content: base64Content,
                encoding: 'base64'
            });
            treeItems.push({
                path: img.path,
                mode: '100644',
                type: 'blob',
                sha: imgBlobRes.data.sha
            });
        }

        // C. Construct composite overlay Tree structure
        const treeRes = await octokit.rest.git.createTree({
            owner, repo,
            tree: treeItems,
            base_tree: rootTreeSha
        });

        // D. Commit merged tree upstream
        const newCommitRes = await octokit.rest.git.createCommit({
            owner, repo,
            message: commitMessage || 'Dashboard Automation: Catalog Configuration Update',
            tree: treeRes.data.sha,
            parents: [commitSha]
        });

        // E. Adjust branch pointer (push execution)
        await octokit.rest.git.updateRef({
            owner, repo,
            ref: `heads/${branch}`,
            sha: newCommitRes.data.sha
        });

        return new Response(JSON.stringify({ 
            success: true, 
            commitUrl: newCommitRes.data.html_url 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Dashboard GitHub Publish Pipeline Error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Internal API processing fault.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
