import clientPromise from '../../../lib/mongodb';
import AddProductForm from '../../../components/dashboard/AddProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage(props) {
    const searchParams = await props.searchParams;
    const { productId, draftId, archiveId } = searchParams || {};

    const client = await clientPromise;
    const db = client.db('velcaryn');
    
    const [categoriesResult, productsResult] = await Promise.all([
        db.collection('categories').find({}).toArray(),
        productId || archiveId ? db.collection('products').findOne({ id: productId || archiveId }) : Promise.resolve(null)
    ]);

    const categories = JSON.parse(JSON.stringify(categoriesResult));
    let initialData = productsResult ? JSON.parse(JSON.stringify(productsResult)) : null;

    // Handle archive flag if needed
    if (archiveId && initialData) {
        initialData.isArchived = true;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>{productId || draftId || archiveId ? 'Edit Product' : 'Add New Product'}</h1>
                <p>{productId || draftId || archiveId
                    ? 'Modify an existing entry before committing to the live catalog.'
                    : 'Draft a brand new catalog item and publish it to the live website.'
                }</p>
            </div>
            <AddProductForm categories={categories} initialData={initialData} draftId={draftId} />
        </div>
    );
}
