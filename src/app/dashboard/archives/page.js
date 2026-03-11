import { Octokit } from 'octokit';
import { unstable_noStore as noStore } from 'next/cache';
import ArchivesClient from '../../../components/dashboard/ArchivesClient';

const IS_PROD = process.env.NODE_ENV === 'production';

export const dynamic = 'force-dynamic';

async function getArchiveData() {
    if (IS_PROD) {
        noStore();
        const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });
        try {
            const res = await octokit.rest.repos.getContent({
                owner: 'velcaryn', repo: 'velcaryn-web', path: 'public/data/archive.json'
            });
            const content = Buffer.from(res.data.content, 'base64').toString('utf8');
            return JSON.parse(content);
        } catch (e) {
            if (e.status === 404) return { archived_products: [] };
            throw e;
        }
    } else {
        const fs = require('fs');
        const path = require('path');
        const archivePath = path.join(process.cwd(), 'public', 'data', 'archive.json');
        return fs.existsSync(archivePath) ? JSON.parse(fs.readFileSync(archivePath, 'utf8')) : { archived_products: [] };
    }
}

export default async function ArchivesPage() {
    const archiveData = await getArchiveData();

    return (
        <div>
            <div className="dashboard-header">
                <h1>Archived Products</h1>
                <p>These products have been removed from the live website but their data and images remain safely stored here.</p>
            </div>
            
            <ArchivesClient initialArchives={archiveData.archived_products} />
        </div>
    );
}
