import clientPromise from '../../lib/mongodb';
import CatalogManager from '../../components/dashboard/CatalogManager';

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
    const client = await clientPromise;
    const db = client.db('velcaryn');
    
    const [products, categories] = await Promise.all([
        db.collection('products').find({}).toArray(),
        db.collection('categories').find({}).toArray()
    ]);

    // Strip ObjectIds for serialization to Client Components if needed
    const serializedProducts = JSON.parse(JSON.stringify(products));
    const serializedCategories = JSON.parse(JSON.stringify(categories));

    return (
        <div>
            <div className="dashboard-header">
                <h1>Current Catalog</h1>
                <p>Overview of the {serializedProducts.length} active products currently live on the main website.</p>
            </div>
            <CatalogManager initialProducts={serializedProducts} categories={serializedCategories} />
        </div>
    );
}
