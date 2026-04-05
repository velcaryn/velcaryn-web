import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const descriptionMapping = {
    "cd-1001": "Biocompatible polyurethane multi-lumen catheter kit for secure central venous access, available in single to four-lumen configurations.",
    "cd-1002": "Temporary vascular access kit with large-bore dual lumens forming a complete hemodialysis blood circuit, in straight and curved extension types.",
    "permacatheter": "Tunneled long-term dialysis catheter engineered for durable vascular access and consistent flow in extended hemodialysis therapy.",
    "cd-1005": "Y-shaped peritoneal dialysis set with kink-resistant tubing and dual control clamps for smooth solution delivery and drainage.",
    "av-fistula-needle": "Precision needle for reliable, atraumatic arteriovenous fistula access during repeated hemodialysis sessions.",
    "u-2016": "Short-term intermittent bladder catheter with atraumatic rounded tip, color-coded in French sizes 6–24, available in male and female versions.",
    "u-2001-to-u-2012": "Sterile urine collection bags in 500–2000 ml capacities with non-return valves, graduated transparent sheeting, and multiple outlet options.",
    "u-2017": "Y-shaped endoscopic irrigation set with thumb-operated clamps designed for transurethral resection of the prostate.",
    "u-2018": "Silicone-coated latex Foley catheter for short and long-term bladder drainage, available in 2-way and 3-way across sizes 6–26 Fr.",
    "u-2019": "100% medical grade silicone Foley catheter with X-ray opaque line and transparent tubing for long-term atraumatic urine drainage.",
    "double-j-stent": "Double J ureteral stent in open and closed end types for maintaining ureteral patency and unobstructed urinary drainage.",
    "s-4008": "Post-operative abdominal drainage catheter with six lateral eyes and a 2000 ml graduated collection bag, available in 16–36 Fr sizes."
};

async function updateDescriptions() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel for 1-liner Description Rewrite...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');

        let updatedCount = 0;

        for (const [productId, newDescription] of Object.entries(descriptionMapping)) {
            const result = await collection.updateOne(
                { id: productId },
                { $set: { description: newDescription } }
            );

            if (result.matchedCount > 0) {
                console.log(`[SUCCESS] Re-mapped 1-liner for SKU: ${productId}`);
                updatedCount++;
            } else {
                console.warn(`[WARNING] Failed to locate SKU: ${productId}`);
            }
        }

        console.log(`==========================================`);
        console.log(`[COMPLETED] Successfully rewrote descriptions for ${updatedCount} NoSQL documents.`);
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

updateDescriptions();
