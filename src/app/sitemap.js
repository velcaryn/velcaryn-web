import clientPromise from '../../src/lib/mongodb';

export default async function sitemap() {
    const baseUrl = 'https://www.velcaryn.com';

    let productUrls = [];
    try {
        const client = await clientPromise;
        const db = client.db('velcaryn');
        const products = await db.collection('products').find({}, { projection: { categorySlug: 1, slug: 1, _id: 0 } }).toArray();

        productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product.categorySlug}/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));
    } catch (err) {
        console.error("Sitemap: MongoDB fetch failed, falling back to empty product list", err);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/quote`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...productUrls,
    ];
}
