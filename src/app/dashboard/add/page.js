import fs from 'fs';
import path from 'path';
import AddProductForm from '../../../components/dashboard/AddProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage(props) {
    const searchParams = await props.searchParams;
    const { productId, draftId, archiveId } = searchParams || {};

    // Read the current catalog.json directly from the public folder to populate category dropdown
    const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    let initialData = null;
    if (productId) {
        initialData = catalogData.products.find(p => p.id === productId) || null;
    } else if (archiveId) {
        const archivePath = path.join(process.cwd(), 'public', 'data', 'archive.json');
        if (fs.existsSync(archivePath)) {
            const archiveData = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
            const archivedProduct = archiveData.archived_products.find(p => p.id === archiveId);
            if (archivedProduct) {
                initialData = { ...archivedProduct, isArchived: true };
            }
        }
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>{productId || draftId || archiveId ? 'Edit Product' : 'Add New Product'}</h1>
                <p>{productId || draftId || archiveId ? 'Modify an existing entry locally before committing.' : 'Draft a brand new catalog item. Changes here will be pre-processed before deploying to the global GitHub edge network.'}</p>
            </div>
            
            <AddProductForm categories={catalogData.categories} initialData={initialData} draftId={draftId} />
        </div>
    );
}
