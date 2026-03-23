export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/'],
        },
        sitemap: 'https://www.velcaryn.com/sitemap.xml',
    };
}
