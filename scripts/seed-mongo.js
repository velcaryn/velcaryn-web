import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Define the exact connection string
const uri = "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

async function seedDatabase() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel...");
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('velcaryn');
        
        console.log("--> Accessing native catalog.json file...");
        // Use relative pathing from node execution context
        const catalogPath = path.resolve(process.cwd(), 'public/data/catalog.json');
        let catalogData;
        
        try {
             const rawData = fs.readFileSync(catalogPath, 'utf8');
             catalogData = JSON.parse(rawData);
             console.log(`[SUCCESS] Extracted ${catalogData.products.length} Products & ${catalogData.categories.length} Categories from legacy JSON.`);
        } catch(readErr) {
             console.error("[CRITICAL FAILURE] Could not locate or parse public/data/catalog.json");
             process.exit(1);
        }

        // --- Migrate Categories ---
        const categoryCollection = db.collection('categories');
        console.log("--> Purging existing category remote mappings (clean slate)...");
        await categoryCollection.deleteMany({});
        
        if (catalogData.categories && catalogData.categories.length > 0) {
            console.log("--> Injecting Category schemas into MongoDB Edge Atlas...");
            await categoryCollection.insertMany(catalogData.categories);
            console.log("[SUCCESS] Categories Hydrated.");
        }

        // --- Migrate Products ---
        const productCollection = db.collection('products');
        console.log("--> Purging existing product remote mappings (clean slate)...");
        await productCollection.deleteMany({});
        
        if (catalogData.products && catalogData.products.length > 0) {
            console.log("--> Injecting Product schemas into MongoDB Edge Atlas...");
            await productCollection.insertMany(catalogData.products);
            console.log("[SUCCESS] Products Hydrated.");
        }

        console.log("==========================================");
        console.log("MIGRATION COMPLETE. ATLAS IS NOW HOLDING ALL CATALOG STATE.");
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

seedDatabase();
