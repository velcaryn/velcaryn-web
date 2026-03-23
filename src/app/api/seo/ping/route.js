import { NextResponse } from 'next/server';
import catalogData from '../../../../../public/data/catalog.json';

export async function GET(req) {
    try {
        const baseUrl = 'https://www.velcaryn.com';
        const apiKey = 'e02d84793f184e62a8d38865f17d33d9';
        
        // Collate all important discovery endpoints
        const urlList = [
            baseUrl,
            `${baseUrl}/quote`,
            ...catalogData.products.map(p => `${baseUrl}/product/${p.id}`)
        ];

        const payload = {
            host: "www.velcaryn.com",
            key: apiKey,
            keyLocation: `${baseUrl}/${apiKey}.txt`,
            urlList: urlList
        };

        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return NextResponse.json({ success: true, message: `Successfully pinged IndexNow with ${urlList.length} URLs.` });
        } else {
            const errorText = await response.text();
            throw new Error(`IndexNow API responded with ${response.status}: ${errorText}`);
        }

    } catch (error) {
        console.error("SEO Ping Failure:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
