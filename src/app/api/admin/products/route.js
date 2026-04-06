import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        const body = await req.json();
        
        // Ensure exact payload validation locally before mapping to NoSQL Document structures
        if (!body.name || !body.category || !body.description) {
            return NextResponse.json({ success: false, error: "Missing required catalog fields." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('velcaryn');

        // Enforce the SKU pattern logic generated previously
        const newProduct = {
            id: body.id || `PROD-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`,
            name: body.name,
            category: body.category,
            description: body.description,
            image: body.image || "/assets/placeholder.png",
            features: body.features || [],
            specifications: body.specifications || {},
            published: typeof body.published === 'boolean' ? body.published : false,
            createdAt: new Date().toISOString()
        };

        await db.collection('products').insertOne(newProduct);

        return NextResponse.json(
            { success: true, message: "Product officially inserted directly to the database layer.", product: newProduct },
            { status: 201 }
        );

    } catch (error) {
        console.error("ADMIN DATABASE INSERTION FAULT:", error);
        return NextResponse.json(
            { success: false, error: "Database mapping resolution failure targeting admin transaction." },
            { status: 500 }
        );
    }
}
