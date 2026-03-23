import catalogData from '../../public/data/catalog.json';

export default function sitemap() {
    const baseUrl = 'https://www.velcaryn.com';

    // Generate URLs for every single product in the catalog automatically
    const productUrls = catalogData.products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

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
