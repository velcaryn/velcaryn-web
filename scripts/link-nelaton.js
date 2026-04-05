import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

async function linkNelatonImage() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel for Nelaton Image Link...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');

        const result = await collection.updateOne(
            { id: "u-2016" },
            { $set: { image: "Productimages/nelaton-catheter.webp" } }
        );

        if (result.matchedCount > 0) {
            console.log(`[SUCCESS] Linked Productimages/nelaton-catheter.webp to SKU: u-2016`);
        } else {
            console.warn(`[WARNING] Failed to locate SKU: u-2016`);
        }

    } catch (err) {
        console.error("FATAL ATLAS CONNECTION FAULT:", err);
    } finally {
        if (client) {
            await client.close();
            console.log("--> Unmounted Connection.");
        }
    }
}

linkNelatonImage();
