import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const imageMapping = {
    "cd-1001": "Productimages/Central venous catheter kit.jpg",
    "cd-1002": "Productimages/Hemodialysis catheter kit01.jpg",
    "permacatheter": "Productimages/Permacatheter.jpg",
    "cd-1005": "Productimages/Swan neck catheter - peritoneal dialysis kit.jpg",
    "av-fistula-needle": "Productimages/Av fistula needle01.jpg",
    // No explicit match found in directory for Nelaton Catheter (u-2016)
    "u-2001-to-u-2012": "Productimages/urobags01.jpg",
    "u-2017": "Productimages/T.U.R set01.jpg",
    "u-2018": "Productimages/Foley catheter 01.jpg",
    "u-2019": "Productimages/Silicone cathete01.jpg",
    "double-j-stent": "Productimages/DOUBLE J STENT01.jpg",
    "s-4008": "Productimages/ABDOMINAL DRAIN KIT01.jpg"
};

async function linkImagesToMongoDB() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel for Image Mapping Update...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');

        let updatedCount = 0;

        for (const [productId, imagePath] of Object.entries(imageMapping)) {
            const result = await collection.updateOne(
                { id: productId },
                { $set: { image: imagePath } }
            );

            if (result.matchedCount > 0) {
                console.log(`[SUCCESS] Linked ${imagePath} to SKU: ${productId}`);
                updatedCount++;
            } else {
                console.warn(`[WARNING] Failed to locate SKU: ${productId} to link image.`);
            }
        }

        console.log(`==========================================`);
        console.log(`[COMPLETED] Successfully mapped ${updatedCount} high-res images directly to the NoSQL documents.`);
        console.log(`==========================================`);

    } catch (err) {
        console.error("FATAL ATLAS CONNECTION FAULT:", err);
    } finally {
        if (client) {
            await client.close();
            console.log("--> Unmounted Connection.");
        }
    }
}

linkImagesToMongoDB();
