import { getCatalog } from '../../../lib/catalogData';
import CatalogManager from '../../components/dashboard/CatalogManager';

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
    const catalogData = await getCatalog();

    return (
        <div>
            <div className="dashboard-header">
                <h1>Current Catalog</h1>
                <p>Overview of the {catalogData.products.length} active products currently live on the main website.</p>
            </div>
            <CatalogManager initialProducts={catalogData.products} categories={catalogData.categories} />
        </div>
    );
}
