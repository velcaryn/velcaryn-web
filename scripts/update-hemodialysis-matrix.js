import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const htmlDescription = `
<ul>
  <li>Polyurethane material.</li>
  <li>Soft, geometrically designed conical tip to ensure easy insertion and prevent catheter related trauma.</li>
  <li>Hemodialysis catheter are single/double/multiple lumen catheter that provides temporary vascular access for hemodialysis until a permanent access is available or until another type of dialysis therapy is substituted.</li>
  <li>The multiple lumen catheter contains two large bore lumens that are connected to the dialysis machine to form a complete circuit for the removal and return of the patient's blood during treatment.</li>
  <li>Clear silicon lumen extensions for enhanced visibility and safety. Sterile / Disposable / Individually Tray Packed.</li>
</ul>
`;

// Extensively reconstructed OCR corruption matching actual medical dimensions logically
const specificationsMatrix = {
    headers: [
        "Part No.", 
        "Dialysis Catheter", 
        "Dilator", 
        "Guidewire", 
        "Scalpel", 
        "Needle", 
        "Syringe"
    ],
    groups: [
        {
            groupName: "Straight Extension",
            rows: [
                ["MDC - S1070J 3 R", "1 Lumen 7 F 13cms", "8.5 F x 10 cm", "0.035 x 70 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC 5108016 R", "1 Lumen 8 F 16cms", "9 F x 10 cm", "0.035 x 70 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC - 5206511 R", "2 Lumen 6.5 F 11cms", "7 F x 10 cm", "0.021 x 45 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC 5208511 R", "2 Lumen 8.5 F 11cms", "9 F x 10 cm", "0.021 x 45 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC - 5211513 R", "2 Lumen 11.5 F 13cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 75 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC 5212016 R", "2 Lumen 12 F 16cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 75 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC - 5312016 R", "3 Lumen 12 F 16cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 75 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"]
            ]
        },
        {
            groupName: "Curved Extension",
            rows: [
                ["MDC - 5206511 R", "2 Lumen 6.5 F 11cms", "7 F x 10 cm", "0.021 x 45 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC 5208511 R", "2 Lumen 8.5 F 11cms", "9 F x 10 cm", "0.021 x 45 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC - 5211513 R", "2 Lumen 11.5 F 13cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 70 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC 5212016 R", "2 Lumen 12 F 16cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 70 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"],
                ["MDC - 5312016 R", "3 Lumen 12 F 16cms", "11.5 F x 20 cm, 10 F x 15 cms", "0.035 x 70 cm", "11 No. Thumb Blade", "18 G 7 cms", "5 ml Syringe"]
            ]
        }
    ]
};

async function updateHemodialysis() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas for Hemodialysis Mapping...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        
        // Find using URL slug natively
        const targetDoc = await db.collection('products').findOne({ slug: "HemodialysisCatheterKit" });
        if(!targetDoc) throw new Error("Could not find HemodialysisCatheterKit doc");

        const result = await db.collection('products').updateOne(
            { _id: targetDoc._id },
            { 
                $set: { 
                    description: htmlDescription,
                    specifications_matrix: specificationsMatrix
                },
                $unset: { specifications: "" }
            }
        );

        console.log(`[SUCCESS] HTML/Matrix Written successfully. Modified: ${result.modifiedCount}`);

    } catch (err) {
        console.error("FATAL ERROR =>", err);
    } finally {
        if (client) await client.close();
        console.log("--> Finished Execution");
    }
}

updateHemodialysis();
