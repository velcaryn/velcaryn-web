import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db('velcaryn');
        
        // Single isolated extraction utilizing the exact indexed Product ID
        const product = await db.collection('products').findOne({ id: id });
        
        if (!product) {
            return NextResponse.json(
                { success: false, error: "Requested product skew ID was not found within the database structure." },
                { status: 404 }
            );
        }

        // Often landing pages require the specific category metadata tied to the product natively as well
        const category = await db.collection('categories').findOne({ id: product.category });
        
        return NextResponse.json(
            { success: true, product, category },
            { status: 200 }
        );

    } catch (error) {
        console.error(`Isolated SKU (${params?.id}) Catalog extraction fault:`, error);
        return NextResponse.json(
            { success: false, error: "Database mapping resolution failure targeting specific product." },
            { status: 500 }
        );
    }
}
