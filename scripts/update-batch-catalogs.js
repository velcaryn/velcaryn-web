import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const updates = [
    // 1. Swan Neck Catheter
    {
        slug: "SwanNeckCatheterPeritonealDialysisKit",
        update: {
            $set: {
                description: `
<ul>
  <li>Super smooth kink resistance tubing ensures uniform flow rate.</li>
  <li>Clear Transparent & Flexible built in Chamber with sharp and easy piercing Spike.</li>
  <li>Special designed for 'Y' shaped transfusion set for administrating dialysis solution.</li>
  <li>Provided with two upper control clamp to facilitate the attractive change of solution bottles.</li>
  <li>Top lower control clamps help for easy input and drainage of solutions.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`
            },
            $unset: { specifications: "", specifications_matrix: "" }
        }
    },
    // 2. AV Fistula Needle
    {
        slug: "AVFistulaNeedle",
        update: {
            $set: {
                description: `
<ul>
  <li>Super smooth kink resistance tubing ensures uniform flow rate.</li>
  <li>To connect blood lines of the blood vessels through needles when dialysis is carried out through an internal fistula.</li>
  <li>Back eye needle to minimize interruption of blood flow.</li>
  <li>Siliconised ultra thin walled & sharp beveled needle to minimize trauma to the patient.</li>
  <li>Flexible butterfly wing for proper fixation.</li>
  <li>Color coded wing for easy identification of sizes as per standard.</li>
  <li>Also available in Twin pack.</li>
</ul>`,
                specifications: {
                    "Blue (Color Code)": "Size 15 G",
                    "Green (Color Code)": "Size 16 G",
                    "Orange (Color Code)": "Size 17 G"
                }
            },
            $unset: { specifications_matrix: "" }
        }
    },
    // 3. Nelaton Catheter
    {
        slug: "NelatonCatheter",
        update: {
            $set: {
                description: `
<ul>
  <li>Nelaton catheters are used for short term bladder catheterization.</li>
  <li>Super smooth kink resistance tubing ensures uniform flowrate.</li>
  <li>Atraumatic, soft rounded, closed tip with two lateral eyes for efficient drainage.</li>
  <li>Frozen surface tubing for super smooth intubation.</li>
  <li>Proximal end is fitted with universal funnel shaped connector for extension.</li>
  <li>Color coded connectors for easy identification of size as per standards.</li>
  <li>X-Ray opaque line provided through out the length of catheter.</li>
  <li>Available in Male & Female Version.</li>
  <li>Available with DEHP Free Material.</li>
  <li>Length : 40cm - Sterile / Disposable / Individually Packed.</li>
</ul>`,
                specifications: {
                    "Light Green": "Size 6 FG",
                    "Blue": "Size 8 FG",
                    "Black": "Size 10 FG",
                    "White": "Size 12 FG",
                    "Green": "Size 14 FG",
                    "Orange": "Size 16 FG",
                    "Red": "Size 18 FG",
                    "Yellow": "Size 20 FG",
                    "Violet": "Size 22 FG",
                    "Light Blue": "Size 24 FG"
                }
            },
            $unset: { specifications_matrix: "" }
        }
    },
    // 4. Urobags All Types
    {
        slug: "UrobagsAllTypes",
        update: {
            $set: {
                description: `
<ul>
  <li>Urine Drainage system for short as well as long term Use.</li>
  <li>Super smooth kind resistance tube provided with universal tapered connector.</li>
  <li>Specialty designed hook or hanger facilities for carrying, handling and holding the tube in upright position.</li>
  <li>Efficient non return valve prevents the back flow.</li>
  <li>Drainage Outlet System.</li>
  <li>Bag graduated in ml to indicate the quantity of urine collected.</li>
  <li>Transparent sheeting allows visual inspection.</li>
</ul>
<br/>
<strong>Options Available:</strong>
<ul>
  <li>With various type of specially molded hangers.</li>
  <li>With or Without “T” Type, Screw Type or Push-Pull type Bottom Outlet</li>
  <li>With or Without Pinch Clamp.</li>
  <li>Tube Length : 90cm, 100cm, 120cm, 150cm.</li>
  <li>Size : 500ml., 1000ml., 1500ml., 2000ml.</li>
  <li>With or Without Sampling Port Sterile or Non-Sterile</li>
</ul>
<br/>
<strong>Other Urobags types available:</strong>
<ul>
  <li>Leg Urine Collection Bag</li>
  <li>Paediatric Urine Collecting Bag</li>
  <li>Urine Collecting Bag With Measured Volume Chamber</li>
</ul>`
            },
            $unset: { specifications: "", specifications_matrix: "" }
        }
    },
    // 5. TUR Set
    {
        slug: "TURSet",
        update: {
            $set: {
                description: `
<ul>
  <li>Super smooth kink resistance tubing ensures uniform flowrate.</li>
  <li>"Y" shaped set for endoscopic irrigation during trans uretheral resection of prostate gland.</li>
  <li>Thumb operated clamps, help quick and smooth changeover of bottles.</li>
  <li>Proximal end fitted with flexible latex tubing for easy connection to endoscope.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`
            },
            $unset: { specifications: "", specifications_matrix: "" }
        }
    },
    // 6. Foley Catheter Regular
    {
        slug: "FoleyCatheterRegular",
        update: {
            $set: {
                description: `
<ul>
  <li>Used for short/long term urine drainage.</li>
  <li>Made from natural latex rubber.</li>
  <li>Silicon elastomer coated smooth surface for atraumatic catheterization.</li>
  <li>High strength polymer layer in the middle layer of the catheter ensures wider inner diameter and hence high flow rate.</li>
  <li>Minimizes encrustation and subsequent catheter blockage and failure.</li>
  <li>Smooth eye, ultra thin highly elastic balloon and hard non-return valve for trouble free inflation and deflation.</li>
  <li>Coned distal end provided with burr free eyes for atraumatic intubation.</li>
  <li>Hard valve ensures easy inflation and deflation of balloon.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`,
                specifications_matrix: {
                    headers: ["Size in FG", "Balloon Capacity"],
                    groups: [
                        {
                            groupName: "Two Way",
                            rows: [
                                ["6", "3 cc"],
                                ["8 - 10", "3 cc - 5 cc"],
                                ["12 - 14", "5 cc - 15 cc"],
                                ["16 - 25", "30 cc - 50 cc"]
                            ]
                        },
                        {
                            groupName: "Three Way",
                            rows: [
                                ["16, 18, 20, 22, 24 & 26", "30 cc - 50 cc"],
                                ["14", "15 cc - 30 cc"]
                            ]
                        }
                    ]
                }
            },
            $unset: { specifications: "" }
        }
    },
    // 7. Silicone Catheter
    {
        slug: "SiliconeCatheter",
        update: {
            $set: {
                description: `
<ul>
  <li>100 % Medical grade silicone for Superior Biocompatibility.</li>
  <li>Used for long term urine drainage-Transparent medical grade silicone tube allows easy visual inspection and fluid observation.</li>
  <li>Non-toxic, bio-compatible and extra smooth for maximum patient comfort.</li>
  <li>Symmetrical balloon, rounded sealed tip and hard non-return.</li>
  <li>X-ray opaque line allows for confirmation of intubated tube using X-ray.</li>
  <li>Soft and uniformly inflated balloon makes the tube sit well against the bladder.</li>
  <li>Smooth round shaft can minimize trauma during insertion and withdrawal.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`,
                specifications_matrix: {
                    headers: ["Size in FG", "Balloon Capacity"],
                    groups: [
                        {
                            groupName: "Two Way",
                            rows: [
                                ["6", "3 cc"],
                                ["8 - 10", "3 cc - 5 cc"],
                                ["12 - 14", "5 cc - 15 cc"],
                                ["16 - 25", "30 cc - 50 cc"]
                            ]
                        },
                        {
                            groupName: "Three Way",
                            rows: [
                                ["16, 18, 20, 22, 24 & 26", "30 cc - 50 cc"],
                                ["14", "15 cc - 30 cc"]
                            ]
                        }
                    ]
                }
            },
            $unset: { specifications: "" }
        }
    },
    // 8. DJ Stents
    {
        slug: "DJStents",
        update: {
            $set: {
                description: `
<ul>
  <li>D. J. Stent used for temporary internal drainage from ureteropelvic junction to the bladder.</li>
  <li>Made of superior grade poly-urethane material.</li>
  <li>Black line on the stent indicates the direction of coil after withdrawal of guide wire.</li>
  <li>Complete radio opaque stent for x-ray visualization. Implant tested with an externally low encrustation tendency.</li>
  <li>Ureteral Stent Consist: Stent, Pusher, with or without Thread.</li>
  <li>Ureteral Stent Kit Consist: Stent, Pusher, Guidewire, 2 Clamps with or without Thread.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`,
                specifications: {
                    "Size in FG": "4.0, 4.5, 4.8, 5.0, 5.5, 6.0",
                    "Length in CM": "16, 20, 26, 28",
                    "Type": "Open end & Close End"
                }
            },
            $unset: { specifications_matrix: "" }
        }
    },
    // 9. Abdominal Drain Kit
    {
        slug: "AbdominalDrainKit",
        update: {
            $set: {
                description: `
<ul>
  <li>Specially designed for post operative abdominal drainage.</li>
  <li>Super smooth kink resistance tubing ensures uniform flowrate.</li>
  <li>Soft abdominal drainage catheter with collection bag of 2000 ml. capacity.</li>
  <li>Catheter is Atraumatic, soft rounded, Open Distal end with six lateral eyes for non-traumatic insertion.</li>
  <li>X-ray opaque line provided throughout the length of catheter.</li>
  <li>Specially designed handle holds tube up right and facilitates carrying.</li>
  <li>Transparent sheeting allows visual inspection.</li>
  <li>Available with DEHP Free Material.</li>
  <li>Sterile / Disposable / Individually Packed.</li>
</ul>`,
                specifications: {
                    "Size FG": "16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36"
                }
            },
            $unset: { specifications_matrix: "" }
        }
    }
];

async function updateAllProducts() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas for Massive Batch Override...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');
        
        let counter = 0;
        for (const op of updates) {
            const targetDoc = await collection.findOne({ slug: op.slug });
            if (targetDoc) {
                const result = await collection.updateOne({ _id: targetDoc._id }, op.update);
                console.log(`[UPDATED] ${op.slug} (Modified: ${result.modifiedCount})`);
                counter += result.modifiedCount;
            } else {
                console.warn(`[MISSING] Could not locate document measuring slug: ${op.slug}`);
            }
        }

        console.log(`\n[SUCCESS] Completed Execution. Total Documents Handled: ${counter}`);

    } catch (err) {
        console.error("FATAL ERROR =>", err);
    } finally {
        if (client) await client.close();
    }
}

updateAllProducts();
