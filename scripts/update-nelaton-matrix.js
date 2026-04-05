import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const specificationsMatrix = {
    headers: ["Size FG", "Color Code"],
    groups: [
        {
            groupName: "Catheter Specifications",
            rows: [
                ["6", "Light Green"],
                ["8", "Blue"],
                ["10", "Black"],
                ["12", "White"],
                ["14", "Green"],
                ["16", "Orange"],
                ["18", "Red"],
                ["20", "Yellow"],
                ["22", "Violet"],
                ["24", "Light Blue"]
            ]
        }
    ]
};

async function updateNelaton() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas to Structure Nelaton Catheter Matrix...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        
        // Find using URL slug natively
        const targetDoc = await db.collection('products').findOne({ slug: "NelatonCatheter" });
        if(!targetDoc) throw new Error("Could not find NelatonCatheter doc");

        const result = await db.collection('products').updateOne(
            { _id: targetDoc._id },
            { 
                $set: { 
                    specifications_matrix: specificationsMatrix
                },
                $unset: { specifications: "" }
            }
        );

        console.log(`[SUCCESS] Nelaton Matrix Written successfully. Modified: ${result.modifiedCount}`);

    } catch (err) {
        console.error("FATAL ERROR =>", err);
    } finally {
        if (client) await client.close();
        console.log("--> Finished Execution");
    }
}

updateNelaton();
