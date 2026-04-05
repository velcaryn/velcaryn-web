import clientPromise from '../../../lib/mongodb';
import CategoriesClient from '../../../components/dashboard/CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const client = await clientPromise;
    const db = client.db('velcaryn');
    
    const categories = await db.collection('categories').find({}).toArray();
    const serializedCategories = JSON.parse(JSON.stringify(categories));

    return (
        <div>
            <div className="dashboard-header">
                <h1>Categories Management</h1>
                <p>Modify the top-level categorization schema used in the sidebar logic of the storefront.</p>
            </div>
            <CategoriesClient initialCategories={serializedCategories} />
        </div>
    );
}
