import fs from 'fs';
import path from 'path';
import CategoriesClient from '../../../components/dashboard/CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    // Read the current catalog.json directly from the public folder
    const catalogPath = path.join(process.cwd(), 'public', 'data', 'catalog.json');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    return (
        <div>
            <div className="dashboard-header">
                <h1>Categories Management</h1>
                <p>Modify the top-level categorization schema used in the sidebar logic of the storefront.</p>
            </div>
            
            <CategoriesClient initialCategories={catalogData.categories} />
        </div>
    );
}
