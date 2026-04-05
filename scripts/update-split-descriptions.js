import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const productsData = [
  {
    "id": "cd-1001",
    "description": "The Central Venous Catheter Kit features a specially formulated biocompatible Polyurethane catheter that provides strength during insertion and softens at body temperature to conform to body tissues, reducing the risk of vascular trauma. Designed for central venous access, the kit includes a soft beveled tip for smooth insertion, a flexible J-tip guidewire to prevent vessel perforation, and radio-opaque catheter material with clear markings for accurate placement. Available in Single, Double, Triple, and Four Lumen configurations. Sterile, Disposable, Individually Tray Packed.",
    "short_description": "Biocompatible polyurethane multi-lumen catheter kit for secure central venous access, available in single to four-lumen configurations."
  },
  {
    "id": "cd-1002",
    "description": "The Hemodialysis Catheter Kit provides temporary vascular access for hemodialysis until a permanent access is available or until another dialysis therapy is substituted. Made from Polyurethane with a soft, geometrically designed conical tip for easy insertion and prevention of catheter-related trauma. Available in single, double, and triple lumen configurations with clear silicone lumen extensions for enhanced visibility and safety. The double lumen design contains two large bore lumens that connect to the dialysis machine to form a complete circuit for blood removal and return. Available in Straight and Curved Extension types. Sterile, Disposable, Individually Tray Packed.",
    "short_description": "Temporary vascular access kit with large-bore dual lumens forming a complete hemodialysis blood circuit, in straight and curved extension types."
  },
  {
    "id": "permacatheter",
    "description": "Permacatheter (permanent tunneled dialysis catheter) for long-term hemodialysis access. Engineered for patient comfort and consistent flow performance over prolonged use.",
    "short_description": "Tunneled long-term dialysis catheter engineered for durable vascular access and consistent flow in extended hemodialysis therapy."
  },
  {
    "id": "cd-1005",
    "description": "A specially designed Y-shaped peritoneal dialysis transfusion set for administering dialysis solution. Features super smooth kink-resistant tubing for uniform flow rate, a clear transparent flexible chamber with a sharp piercing spike, two upper control clamps to facilitate solution bottle changes, and top and lower control clamps for easy input and drainage of solutions. Sterile, Disposable, Individually Packed.",
    "short_description": "Y-shaped peritoneal dialysis set with kink-resistant tubing and dual control clamps for smooth solution delivery and drainage."
  },
  {
    "id": "av-fistula-needle",
    "description": "AV Fistula Needle used for accessing arteriovenous fistulas during hemodialysis. Precision-engineered needle designed for reliable and atraumatic access to arteriovenous fistulas during hemodialysis sessions. Built for consistent puncture performance and patient comfort across repeated use.",
    "short_description": "Precision needle for reliable, atraumatic arteriovenous fistula access during repeated hemodialysis sessions."
  },
  {
    "id": "u-2016",
    "description": "Nelaton Catheters are designed for short-term bladder catheterization. The catheter features super smooth kink-resistant tubing for uniform flow rate, an atraumatic soft rounded closed tip with two lateral eyes for efficient drainage, and a frosted surface for smooth intubation. The proximal end has a universal funnel-shaped connector for extension, and color-coded connectors allow easy size identification per standards. An X-ray opaque line runs throughout the catheter length. Available in Male and Female versions, and with DEHP-free material. Length: 40 cm. Sterile, Disposable, Individually Packed.",
    "short_description": "Short-term intermittent bladder catheter with atraumatic rounded tip, color-coded in French sizes 6–24, available in male and female versions."
  },
  {
    "id": "u-2001-to-u-2012",
    "description": "A urine drainage system suitable for both short and long-term use. Features super smooth kink-resistant tubing with a universal tapered connector, an efficient non-return valve to prevent backflow, and a transparent graduated bag for visual inspection and volume monitoring. Specialty-designed hooks or hangers allow easy carrying and upright positioning. Available in multiple sizes, tube lengths, outlet types, and with or without a sampling port.",
    "short_description": "Sterile urine collection bags in 500–2000 ml capacities with non-return valves, graduated transparent sheeting, and multiple outlet options."
  },
  {
    "id": "u-2017",
    "description": "The TUR (Trans Urethral Resection) Set is a Y-shaped irrigation set designed for endoscopic irrigation during transurethral resection of the prostate gland. Features super smooth kink-resistant tubing for uniform flow rate, thumb-operated clamps for quick and smooth bottle changeover, and a flexible latex proximal end for easy connection to the endoscope. Sterile, Disposable, Individually Packed.",
    "short_description": "Y-shaped endoscopic irrigation set with thumb-operated clamps designed for transurethral resection of the prostate."
  },
  {
    "id": "u-2018",
    "description": "A latex-based Foley Balloon Catheter for short and long-term urine drainage. Made from natural latex rubber with a silicone elastomer coating for a smooth, atraumatic catheterization experience. A high-strength polymer middle layer ensures a wider inner diameter and high flow rate, while minimizing encrustation and catheter blockage. Features a smooth eye, an ultra-thin highly elastic balloon, and a hard non-return valve for trouble-free inflation and deflation. Available in 2-Way and 3-Way configurations. Sterile, Disposable, Individually Packed.",
    "short_description": "Silicone-coated latex Foley catheter for short and long-term bladder drainage, available in 2-way and 3-way across sizes 6–26 Fr."
  },
  {
    "id": "u-2019",
    "description": "A 100% medical grade silicone Foley Balloon Catheter designed for long-term urine drainage. The transparent silicone tube allows easy visual inspection and fluid monitoring. Non-toxic, biocompatible, and extra smooth for maximum patient comfort. Features a symmetrical balloon, rounded sealed tip, hard non-return valve, and an X-ray opaque line for placement confirmation. Available in 2-Way and 3-Way configurations. Sterile, Disposable, Individually Packed.",
    "short_description": "100% medical grade silicone Foley catheter with X-ray opaque line and transparent tubing for long-term atraumatic urine drainage."
  },
  {
    "id": "double-j-stent",
    "description": "Double J (DJ) Stent available in open and closed end configurations for ureteral stenting. Designed for reliable internal stenting with secure positioning between the kidney and bladder.",
    "short_description": "Double J ureteral stent in open and closed end types for maintaining ureteral patency and unobstructed urinary drainage."
  },
  {
    "id": "s-4008",
    "description": "The Abdominal Drain Kit (Medi-ADK) is specially designed for post-operative abdominal drainage. It includes a soft abdominal drainage catheter with an atraumatic open distal end and six lateral eyes for non-traumatic insertion, connected to a 2000 ml collection bag. The X-ray opaque line runs throughout the catheter length for imaging verification. Features super smooth kink-resistant tubing for uniform flow, a specially designed handle for upright positioning and carrying ease, and transparent sheeting for visual inspection. Available with DEHP-free material. Sterile, Disposable, Individually Packed.",
    "short_description": "Post-operative abdominal drainage catheter with six lateral eyes and a 2000 ml graduated collection bag, available in 16–36 Fr sizes."
  }
];

async function updateSplitDescriptions() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas Tunnel for Dual Description Rewrite...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        const collection = db.collection('products');

        let updatedCount = 0;

        for (const data of productsData) {
            const result = await collection.updateOne(
                { id: data.id },
                { $set: { 
                    description: data.description,
                    short_description: data.short_description
                } }
            );

            if (result.matchedCount > 0) {
                console.log(`[SUCCESS] Decoupled descriptions for SKU: ${data.id}`);
                updatedCount++;
            } else {
                console.warn(`[WARNING] Failed to locate SKU: ${data.id}`);
            }
        }

        console.log(`==========================================`);
        console.log(`[COMPLETED] Successfully split texts for ${updatedCount} NoSQL documents.`);
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

updateSplitDescriptions();
