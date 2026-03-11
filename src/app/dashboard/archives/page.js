import fs from 'fs';
import path from 'path';
import ArchivesClient from '../../../components/dashboard/ArchivesClient';

export const dynamic = 'force-dynamic';

export default async function ArchivesPage() {
    // Read the current archive.json directly from the public folder
    const archivePath = path.join(process.cwd(), 'public', 'data', 'archive.json');
    let archiveData = { archived_products: [] };
    
    if (fs.existsSync(archivePath)) {
        archiveData = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
    }

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
