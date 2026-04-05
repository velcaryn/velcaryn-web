import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const migrationMap = {
    "cd-1001": { id: "VelcarynVD-001", categorySlug: "vascularanddialysis", slug: "CentralVenousCatheterKit" },
    "cd-1002": { id: "VelcarynVD-002", categorySlug: "vascularanddialysis", slug: "HemodialysisCatheterKit" },
    "permacatheter": { id: "VelcarynVD-003", categorySlug: "vascularanddialysis", slug: "Permacatheter" },
    "cd-1005": { id: "VelcarynVD-004", categorySlug: "vascularanddialysis", slug: "SwanNeckCatheterPeritonealDialysisKit" },
    "av-fistula-needle": { id: "VelcarynVD-005", categorySlug: "vascularanddialysis", slug: "AVFistulaNeedle" },
    "u-2016": { id: "VelcarynUrology-001", categorySlug: "urology", slug: "NelatonCatheter" },
    "u-2001-to-u-2012": { id: "VelcarynUrology-002", categorySlug: "urology", slug: "UrobagsAllTypes" },
    "u-2017": { id: "VelcarynUrology-003", categorySlug: "urology", slug: "TURSet" },
    "u-2018": { id: "VelcarynUrology-004", categorySlug: "urology", slug: "FoleyCatheterRegular" },
    "u-2019": { id: "VelcarynUrology-005", categorySlug: "urology", slug: "SiliconeCatheter" },
    "double-j-stent": { id: "VelcarynUrology-006", categorySlug: "urology", slug: "DJStents" },
    "s-4008": { id: "VelcarynSurgery-001", categorySlug: "surgery", slug: "AbdominalDrainKit" }
};

async function migrateData() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel for SEO Destructive Modification...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');

        let updatedCount = 0;

        for (const [oldId, newProps] of Object.entries(migrationMap)) {
            const result = await collection.updateOne(
                { id: oldId },
                { $set: newProps }
            );

            if (result.matchedCount > 0) {
                console.log(`[SUCCESS] Remapped ${oldId} -> ID: ${newProps.id} | Slug: /${newProps.categorySlug}/${newProps.slug}`);
                updatedCount++;
            } else {
                console.warn(`[WARNING] Failed to locate Legacy ID: ${oldId}`);
            }
        }

        console.log(`==========================================`);
        console.log(`[COMPLETED] Successfully wiped and re-structured ${updatedCount} DB collections universally.`);
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

migrateData();
