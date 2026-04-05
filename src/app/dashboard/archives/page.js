import clientPromise from '../../../lib/mongodb';
import ArchivesClient from '../../../components/dashboard/ArchivesClient';

export const dynamic = 'force-dynamic';

export default async function ArchivesPage() {
    const client = await clientPromise;
    const db = client.db('velcaryn');
    
    const archivedProducts = await db.collection('products').find({ published: false }).toArray();
    const serializedArchives = JSON.parse(JSON.stringify(archivedProducts));

    return (
        <div>
            <div className="dashboard-header">
                <h1>Archived Products</h1>
                <p>These products have been removed from the live website but their data and images remain safely stored here.</p>
            </div>
            <ArchivesClient initialArchives={serializedArchives} />
        </div>
    );
}
