import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

function slugify(text) {
    if (!text) return `sku-${Date.now()}`;
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function injectNewCatalog() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');

        const rawPath = path.resolve(process.cwd(), 'scripts/new-raw-catalog.json');
        const rawData = fs.readFileSync(rawPath, 'utf8');
        const newCatalogRaw = JSON.parse(rawData);

        // 1. Array translation mapping raw client keys into our internal Product Schema
        const translatedProducts = newCatalogRaw.map(item => {
            const id = item.model_number ? slugify(item.model_number) : slugify(item.product_name);
            
            // Build the specifications block
            let finalSpecs = item.technical_specs || {};
            if (item.kit_components && Array.isArray(item.kit_components)) {
                finalSpecs["Kit Components"] = item.kit_components.join(", ");
            }
            if (item.type) finalSpecs["Type"] = item.type;

            return {
                id: id,
                name: item.product_name,
                category: slugify(item.category), // Reference the category ID
                description: item.description,
                image: item.image_url || "/assets/placeholder.png",
                isQuoteOnly: true, // Assuming B2B medial commodities require quotes
                specifications: finalSpecs,
                published: true,
                createdAt: new Date().toISOString()
            };
        });

        // 2. Discover and map unique Categories generated organically from the Dataset
        const uniqueCategoriesMap = {};
        newCatalogRaw.forEach(item => {
            if (item.category) {
                const catId = slugify(item.category);
                if (!uniqueCategoriesMap[catId]) {
                    uniqueCategoriesMap[catId] = {
                        id: catId,
                        name: item.category,
                        description: `All general products falling under ${item.category}`
                    };
                }
            }
        });
        const translatedCategories = Object.values(uniqueCategoriesMap);

        // 3. Purge existing collections to prevent overlapping ghost data
        const productCollection = db.collection('products');
        const categoryCollection = db.collection('categories');
        
        console.log("--> Purging legacy remote mappings...");
        await productCollection.deleteMany({});
        await categoryCollection.deleteMany({});

        // 4. Inject
        console.log(`--> Injecting ${translatedCategories.length} dynamically generated Categories...`);
        await categoryCollection.insertMany(translatedCategories);

        console.log(`--> Injecting ${translatedProducts.length} newly shaped Products...`);
        await productCollection.insertMany(translatedProducts);

        console.log("==========================================");
        console.log("[SUCCESS] ATLAS CATALOG REWRITE EXECUTED FLAWLESSLY.");
        console.log("==========================================");

    } catch (err) {
        console.error("FATAL ATLAS CONNECTION FAULT:", err);
    } finally {
        if (client) {
            await client.close();
            console.log("--> Unmounted Connection.");
        }
    }
}

injectNewCatalog();
