import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://admin_db_user:R5NBH7ZWY76ZjlPv@cluster0.tfvhirv.mongodb.net/velcaryn?retryWrites=true&w=majority&appName=Cluster0";

const htmlDescription = `
<ul>
  <li>Central Venous Catheter made of specially formulated and biocompatible Polyurethane material provides strength during insertion and also softens at body temperature to conform to the body tissues and reduces the risk and vascular trauma.</li>
  <li>Specially Designed Soft & beveled tip for smooth & easy insertion of catheter.</li>
  <li>Soft Flexible J-Tip Guide wire prevents the vessel perforation and also provides good torque to ensure film insertion.</li>
  <li>Sufficiently radio-Opaque material of catheter with clear, definite marking facilitates correct placement of catheter tip.</li>
  <li>Kink resistant Guidewire with soft & flexible J-tip offers better torque which helps in easy insertion & prevents vessel perforation.</li>
  <li>Wires are Double Distal.</li>
  <li>2 piece design of guidewire advancer. Sterile / Disposable / Individually Tray Packed.</li>
</ul>

<br/>

<strong>Complete Set of CVC Kit Consist</strong>
<ul>
  <li>Indwelling catheter.</li>
  <li>Y-Introducer needle with check valve.</li>
  <li>J-Tip guide wire.</li>
  <li>Vessel dilator.</li>
  <li>Luer lock syrings.</li>
  <li>Scalpel.</li>
  <li>Catheter holder.</li>
  <li>Catheter holder clamp.</li>
  <li>Injection cap.</li>
  <li>Extension Line Clamp.</li>
  <li>Guiding Syringe / LOR Syringe (Optional).</li>
</ul>
`;

async function updateCVCDescription() {
    let client;
    try {
        console.log("--> Mounting MongoDB Atlas to Formulate Native HTML Arrays...");
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('velcaryn');
        
        // Execute structural Database Overwrite targeting description exactly
        const result = await db.collection('products').updateOne(
            { id: "VelcarynVD-001" },
            { 
                $set: { 
                    description: htmlDescription
                }
            }
        );

        console.log(`[SUCCESS] HTML Mapping Written successfully to: VelcarynVD-001`);

    } catch (err) {
        console.error("FATAL ERROR =>", err);
    } finally {
        if (client) await client.close();
        console.log("--> Finished Execution");
    }
}

updateCVCDescription();
