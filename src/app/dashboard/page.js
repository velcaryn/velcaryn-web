import fs from 'fs';
import path from 'path';
import CatalogManager from '../../components/dashboard/CatalogManager';

// Force dynamic since we want to read the latest JSON on every load
export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
    // Read the current catalog.json directly from the public folder
    const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    return (
        <div>
            <div className="dashboard-header">
                <h1>Current Catalog</h1>
                <p>Overview of the {catalogData.products.length} active products currently live on the main website. Adjust the order below to dictate the layout on the live site.</p>
            </div>

            <CatalogManager initialProducts={catalogData.products} categories={catalogData.categories} />
        </div>
    );
}
