import { getCatalog, getArchive } from '../../../../lib/catalogData';
import ArchivesClient from '../../../components/dashboard/ArchivesClient';

export const dynamic = 'force-dynamic';

export default async function ArchivesPage() {
    const archiveData = await getArchive();

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
