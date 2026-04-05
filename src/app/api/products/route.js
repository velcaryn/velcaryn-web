import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// Config parameter: bypass cached static builds to force real-time reads globally
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await clientPromise;
        // Select 'velcaryn' database, ensuring exact parity with seeding scripts
        const db = client.db('velcaryn');
        
        // Parallelized extraction of both master collections
        const [products, categories] = await Promise.all([
            db.collection('products').find({}, { projection: { _id: 0 } }).toArray(),
            db.collection('categories').find({}, { projection: { _id: 0 } }).toArray()
        ]);
        
        return NextResponse.json(
            { success: true, products, categories },
            { 
                status: 200,
                headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
            }
        );

    } catch (error) {
        console.error("Global Catalog API extraction fault:", error);
        return NextResponse.json(
            { success: false, error: "Database mapping resolution failure." },
            { status: 500 }
        );
    }
}
