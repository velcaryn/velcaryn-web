import { getCatalog, getArchive } from '../../../lib/catalogData';
import AddProductForm from '../../../components/dashboard/AddProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage(props) {
    const searchParams = await props.searchParams;
    const { productId, draftId, archiveId } = searchParams || {};

    const catalogData = await getCatalog();

    let initialData = null;
    if (productId) {
        initialData = catalogData.products.find(p => p.id === productId) || null;
    } else if (archiveId) {
        const archiveData = await getArchive();
        const archivedProduct = archiveData.archived_products.find(p => p.id === archiveId);
        if (archivedProduct) {
            initialData = { ...archivedProduct, isArchived: true };
        }
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
            <AddProductForm categories={catalogData.categories} initialData={initialData} draftId={draftId} />
        </div>
    );
}
