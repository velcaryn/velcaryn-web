import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const descriptionText = `**Description**
Central Venous Catheter made of specially formulated and biocompatible Polyurethane material provides strength during insertion and also softens at body temperature to conform to the body tissues and reduces the risk and vascular trauma.
Specially Designed Soft & beveled tip for smooth & easy insertion of catheter.
Soft Flexible J-Tip Guide wire prevents the vessel perforation and also provides good torque to ensure film insertion.
Sufficiently radio-Opaque material of catheter with clear, definite marking facilitates correct placement of catheter tip.
Kink resistant Guidewire with soft & flexible J-tip offers better torque which helps in easy insertion & prevents vessel perforation.
Wires are Double Distal.
2 piece design of guidewire advancer. Sterile / Disposable / Individually Tray Packed.

**Complete Set of CVC Kit Consist**
• Indwelling catheter.
• Y-Introducer needle with check valve.
• J-Tip guide wire.
• Vessel dilator.
• Luer lock syrings.
• Scalpel.
• Catheter holder.
• Catheter holder clamp.
• Injection cap.
• Extension Line Clamp.
• Guiding Syringe / LOR Syringe (Optional).`;

const specificationsMatrix = {
    headers: [
        "Model Type", 
        "Catheter Size Ga/Fr", 
        "Lumen Ga", 
        "Length (cm)", 
        "Dilator Fr", 
        "Guide Wire Nickle Titanium", 
        "With Std. Needle (P/N)", 
        "With Y Needle Std. Syringe (P/N)", 
        "With Std. Needle Introducer Syringe"
    ],
    groups: [
        {
            groupName: "Single Lumen Catheter",
            rows: [
                ["1 Lumen 22 Ga 13cms", "22 Ga", "22", "13", "4", "0.018x45 cm", "MCVC-20 G 01 -13", "-", "MCVC - 22 G 01 13 IS"],
                ["1 Lumen 20 Ga 13 cms", "20 Ga", "20", "13", "4", "0.018x45 cm", "MCVC-20 G 01 -13", "-", "MCVC - 20 G 01 13 IS"],
                ["1 Lumen 18Ga 20cms", "18 Ga", "18", "20", "5", "0.018x45 cm", "MCVC-18 G 01 -20", "-", "MCVC -18 G 01 20 IS"],
                ["1 Lumen 16 Ga 16 cms", "16 Ga", "16", "16", "6", "0.035x45 cm", "MCVC-16G01 -16", "MCVC -16 G 01 -16YN", "MCVC -16 G 01 16 IS"],
                ["1 Lumen 16Ga 20cms", "16 Ga", "16", "20", "6", "0.035x45 cm", "MCVC-16G01 -20", "MCVC -16 G 01 -20YN", "MCVC -16 G 01 20 IS"],
                ["1 Lumen 14Ga 20cms", "14 Ga", "14", "20", "8", "0.035x45 cm", "MCVC-14G01 -20", "MCVC -14 G 01 -20YN", "MCVC -14 G 01 20 IS"]
            ]
        },
        {
            groupName: "Double Lumen Catheter",
            rows: [
                ["2 Lumen 4 Fr 6 cms", "4 Fr", "20, 22", "6", "5", "0.018x45 cm", "MCVC-402-6", "-", "MCVC - 402 6 IS"],
                ["2 Lumen 4 Fr 8 cms", "4 Fr", "20, 22", "8", "5", "0.018x45 cm", "MCVC-402-8", "-", "MCVC - 402 8 IS"],
                ["2 Lumen 4 Fr 13 cms", "4 Fr", "20, 22", "13", "5", "0.018x45 cm", "MCVC-402-13", "-", "MCVC-402 13 IS"],
                ["2 Lumen 5 Fr 8 cms", "5 Fr", "18, 20", "8", "6", "0.018x45 cm", "MCVC-502 -8", "-", "MCVC - 502 8IS"],
                ["2 Lumen 5 Fr 13 cms", "5 Fr", "18, 20", "13", "6", "0.018x45 cm", "MCVC-502 - 13", "-", "MCVC-502 13 IS"],
                ["2 Lumen 7 Fr 16 cms", "7 Fr", "14, 18", "16", "8", "0.035x45 cm", "MCVC-702 - 16", "MCVC- 702 - 16 YN", "MCVC-702 16 IS"],
                ["2 Lumen 7 Fr 20 cms", "7 Fr", "14, 18", "20", "8", "0.035x45 cm", "MCVC- 702 - 20", "MCVC- 702 - 20 YN", "MCVC - 702 20 IS"]
            ]
        },
        {
            groupName: "Triple Lumen Catheter",
            rows: [
                ["3 Lumen 4.5 Fr 6 cms", "4.5 Fr", "20, 22, 22", "6", "6", "0.018x45 cm", "MCVC- 4.503 - 6", "-", "MCVC-4.503-6 IS"],
                ["3 Lumen 4.5 Fr 10 cms", "4.5 Fr", "20, 22, 22", "10", "6", "0.018x45 cm", "MCVC-4.503-10", "-", "MCVC-4.503-10 IS"],
                ["3 Lumen 5.5 Fr 6 cms", "5.5 Fr", "20, 22, 22", "6", "6", "0.018x45 cm", "MCVC- 5.503 - 6", "-", "MCVC - 5.503 - 6 IS"],
                ["3 Lumen 5.5 Fr 8 cms", "5.5 Fr", "20, 22, 22", "8", "6", "0.018x45 cm", "MCVC- 5.503 - 8", "-", "MCVC - 5.503 - 8 IS"],
                ["3 Lumen 5.5 Fr 13 cms", "5.5 Fr", "20, 22, 22", "13", "6", "0.018x45 cm", "MCVC-5.503-13", "-", "MCVC-5.503 -13IS"],
                ["3 Lumen 7 Fr 10 cms", "7 Fr", "16, 18, 18", "10", "8", "0.035x45 cm", "MCVC-703 - 10", "MCVC-703- 10 YN", "MCVC-703-10 IS"],
                ["3 Lumen 7 Fr 13 cms", "7 Fr", "16, 18, 18", "13", "8", "0.035x45 cm", "MCVC-703 - 13", "MCVC-703- 10 YN", "MCVC-703-13 IS"],
                ["3 Lumen 7 Fr 16 cms", "7 Fr", "16, 18, 18", "16", "8", "0.035x45 cm", "MCVC-703 - 16", "MCVC-703- 16 YN", "MCVC-703-16 IS"],
                ["3 Lumen 7 Fr 20 cms", "7 Fr", "16, 18, 18", "20", "8", "0.035x45 cm", "MCVC- 703 - 20", "MCVC- 703 - 20 YN", "MCVC - 703 - 20 IS"]
            ]
        },
        {
            groupName: "Four Lumen Catheter",
            rows: [
                ["4 Lumen 8.5 Fr 10 cms", "8.5 Fr", "14, 16, 18, 18", "10", "9", "0.035x45 cm", "MCVC-8.504-10", "MCVC-8.504-10 YN", "MCVC-8.504-10 IS"],
                ["4 Lumen 8.5 Fr 13 cms", "8.5 Fr", "14, 16, 18, 18", "10", "9", "0.035x45 cm", "MCVC-8.504-13", "MCVC-8.504-13 YN", "MCVC-8.504-13 IS"],
                ["4 Lumen 8.5 Fr 16 cms", "8.5 Fr", "14, 16, 18, 18", "16", "9", "0.035x45 cm", "MCVC-8.504-16", "MCVC-8.504-16 YN", "MCVC-8.504-16 IS"],
                ["4 Lumen 8.5 Fr 20 cms", "8.5 Fr", "14, 16, 18, 18", "20", "9", "0.035x45 cm", "MCVC- 8.504 - 20", "MCVC-8.504-20 YN", "MCVC - 8.504 - 20 IS"]
            ]
        }
    ]
};

async function updateCVC() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas to Structure Large 9-Column Array...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        
        // Execute structural Database Overwrite
        const result = await db.collection('products').updateOne(
            { id: "VelcarynVD-001" }, // Specific mapping target ONLY Central Venous Catheter Kit 
            { 
                $set: { 
                    description: descriptionText,
                    specifications_matrix: specificationsMatrix
                },
                $unset: { specifications: "" } // Destroy obsolete 2-column formatting entirely on CVC explicitly
            }
        );

        console.log(`[SUCCESS] Matched/Modified: ${result.modifiedCount} document(s).`);

    } catch (err) {
        console.error("FATAL ERROR =>", err);
    } finally {
        if (client) await client.close();
        console.log("--> Finished Execution");
    }
}

updateCVC();
