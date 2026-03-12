import { getCatalog } from '../../../lib/catalogData';
import CategoriesClient from '../../../components/dashboard/CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const catalogData = await getCatalog();

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
