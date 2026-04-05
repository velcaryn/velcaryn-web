import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function normalize() {
    console.log("--> Initializing MongoDB Atlas Normalization Engine...");
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');
        const products = await collection.find({}).toArray();

        console.log(`[PROCESS] Normalizing ${products.length} products...`);

        for (const p of products) {
            const updates = {};
            
            // Unify Product Name
            if (!p.name && p.product_name) updates.name = p.product_name;
            if (!p.name && !p.product_name) updates.name = "Unnamed Product";

            // Unify Product ID
            if (!p.id && (p.model_number || p._id)) {
                updates.id = p.model_number || `PROD-${p._id.toString().substring(0, 8)}`;
            }

            // Unify Image (handle empty strings from CSV/JSON import)
            if (p.image === "" || (!p.image && p.image_url)) {
                updates.image = p.image_url || null;
            }

            // Normalize Description (prevent null/undefined in UI)
            if (p.description === undefined || p.description === null) {
                updates.description = "";
            }

            // Standardize Category IDs (ensure lowercase matching for collections)
            // Map legacy strings to correct lowercase ID keys
            const categoryMap = {
                "Urology": "urology",
                "Vascular and Dialysis Access": "vascularanddialysis",
                "Surgical Dressing Products": "surgical_dressings",
                "Surgical Disposable Products": "disposables",
                "Respiratory Care Products": "respiratory",
                "Hospital Consumables": "consumables",
                "Surgery": "surgery"
            };

            if (categoryMap[p.category]) {
                updates.category = categoryMap[p.category];
            } else if (p.category) {
                // Safely convert unknown categories to kebab-case IDs
                updates.category = p.category.toLowerCase().trim().replace(/\s+/g, '_');
            }

            // Auto-generate Category Slugs if missing
            if (!p.categorySlug && updates.category) {
                updates.categorySlug = updates.category.replace(/_/g, '');
            } else if (!p.categorySlug && p.category) {
                updates.categorySlug = p.category.toLowerCase().trim().replace(/[\s_]+/g, '');
            }

            // Auto-generate Product Slugs if missing
            if (!p.slug && (p.name || p.product_name)) {
                const targetName = p.name || p.product_name;
                updates.slug = targetName.toLowerCase().trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_]+/g, '')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('');
            }

            // Unify Specifications
            if (!p.specifications && p.technical_specs) {
                updates.specifications = p.technical_specs;
            }

            if (Object.keys(updates).length > 0) {
                await collection.updateOne({ _id: p._id }, { $set: updates });
                console.log(`[CLEANED] ${p.name || p.product_name || p.id} | Applied ${Object.keys(updates).length} field corrections.`);
            }
        }

        console.log("==========================================");
        console.log("[STABLE] DATABASE NORMALIZATION COMPLETE.");
        console.log("==========================================");
    } catch (err) {
        console.error("[CRITICAL] NORMALIZATION FAULT:", err);
    } finally {
        await client.close();
        console.log("--> Unmounted Connection.");
    }
}

normalize();
