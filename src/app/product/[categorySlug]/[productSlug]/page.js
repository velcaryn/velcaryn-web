import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import ProductActionClient from './ProductActionClient';
import MatrixAccordion from './MatrixAccordion';

// Direct Server Component MongoDB bindings
import clientPromise from '../../../../lib/mongodb';

// Utility: Strip HTML tags for safe meta description text
function stripHtml(html) {
    return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Advanced Next.js API: Generate Dynamic SEO & Open Graph Tags
export async function generateMetadata({ params }) {
    const { categorySlug, productSlug } = await params;
    const client = await clientPromise;
    const db = client.db('velcaryn');
    
    const product = await db.collection('products').findOne({ categorySlug, slug: productSlug });

    if (!product) {
        return { title: 'Product Not Found | Velcaryn' };
    }

    const category = await db.collection('categories').findOne({ id: product.category });
    const categoryName = category ? category.name : product.category;

    // Strip HTML before truncating for clean meta descriptions
    const plainText = stripHtml(product.description);
    const shortDescription = plainText.length > 155 
        ? plainText.substring(0, 155) + '...'
        : plainText;

    return {
        title: `${product.name} | Velcaryn Products`,
        description: shortDescription,
        openGraph: {
            title: `${product.name} | Velcaryn`,
            description: shortDescription,
            images: [{
                url: `https://www.velcaryn.com/${product.image}`, 
                alt: product.name,
                width: 800,
                height: 600,
            }],
            type: 'website',
            siteName: 'Velcaryn'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | Velcaryn`,
            description: shortDescription,
            images: [`https://www.velcaryn.com/${product.image}`],
        }
    };
}

export default async function ProductDetailPage({ params }) {
    const { categorySlug, productSlug } = await params;
    
    const client = await clientPromise;
    const db = client.db('velcaryn');

    const rawProduct = await db.collection('products').findOne({ categorySlug, slug: productSlug });

    if (!rawProduct) {
        notFound();
    }

    const { _id, ...product } = rawProduct;

    const category = await db.collection('categories').findOne({ id: product.category });
    const categoryName = category ? category.name : product.category;

    // Database extraction: Fetch related matrix arrays bypassing current parameter
    let relatedProductsRaw = await db.collection('products').find({ category: product.category, id: { $ne: product.id } }).limit(4).toArray();
    
    // Fallback: Aggressively target alternative scopes if identical mapping hits $0 (e.g. Surgery)
    let isFallback = false;
    if (relatedProductsRaw.length === 0) {
        relatedProductsRaw = await db.collection('products').find({ category: { $ne: product.category } }).limit(4).toArray();
        isFallback = true;
    }
    
    // Strip ObjectIds blocking structural serializations globally
    const relatedProducts = relatedProductsRaw.map(({ _id, ...rest }) => rest);
    
    // Map header nomenclature exactly to the user's explicit specification
    const relatedHeaderString = isFallback ? "View other category products" : `View more products from ${categoryName}`;

    return (
        <>
            <Header />
            <div className="pdp-wrapper">
                <div className="container">
                    
                    <div className="pdp-breadcrumb">
                        <a href="/#catalog" className="back-link" style={{ textDecoration: 'none' }}>
                            Home Catalog
                        </a>
                        <span className="separator">&gt;</span>
                        <a href="/#catalog" className="back-link" style={{ textDecoration: 'none' }}>
                            {categoryName}
                        </a>
                        <span className="separator">&gt;</span>
                        <span className="current-category">{product.name}</span>
                    </div>

                    <div className="pdp-grid">
                        
                        {/* Left Column: Image Gallery */}
                        <div className="pdp-image-column">
                            <div className="pdp-image-container" style={{ position: 'relative' }}>
                                {product.image ? (
                                    <Image 
                                        src={product.image.startsWith('/') || product.image.startsWith('http') || product.image.startsWith('data:') ? product.image : `/${product.image}`}
                                        alt={product.name} 
                                        className="pdp-main-image"
                                        width={800}
                                        height={800}
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        priority
                                    />
                                ) : (
                                    <div className="pdp-placeholder-image">
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                                        <span>Image Coming Soon</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Preview Conditional Rendering */}
                            {product.images && product.images.length > 1 && (
                                <div className="pdp-thumbnails">
                                    {product.images.map((img, idx) => (
                                        <div key={idx} className="pdp-thumbnail-item">
                                            <Image 
                                                src={img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : `/${img}`}
                                                alt={`${product.name} Thumbnail ${idx + 1}`}
                                                fill
                                                style={{ objectFit: 'contain', padding: '0.2rem' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Server-rendered Product Details */}
                        <div className="pdp-details-container">
                            <h1 className="pdp-title">{product.name}</h1>
                            <span className="pdp-badge" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>{categoryName}</span>
                            <p className="pdp-id">Product ID: <strong>{product.id}</strong></p>
                            
                            <div className="pdp-action-block">
                                {product.isQuoteOnly && (
                                    <ProductActionClient product={product} />
                                )}
                                
                                <div className="pdp-support-note">
                                    <p>Have questions about bulk orders?</p>
                                    <a href="/#contact">Contact our sales team directly ➔</a>
                                </div>
                            </div>
                        </div>
                    </div> {/* End of Frame Split */}

                    {/* Extended Details Zone (Full Width) */}
                    <div className="pdp-extended-details">
                        <div className="pdp-description-block">
                            <h3>Description</h3>
                            <div 
                                className={`pdp-description ${/<[a-z][\s\S]*>/i.test(product.description || '') ? 'html-desc' : ''}`} 
                                dangerouslySetInnerHTML={{ __html: product.description }} 
                            />
                        </div>

                        {/* Specifications Engine */}
                        {(() => {
                            const validSpecs = product.specifications 
                                ? Object.entries(product.specifications).filter(([k, v]) => v && String(v).trim() !== '' && String(v).toLowerCase() !== 'n/a')
                                : [];
                            
                            const formatSpecKey = (key) => {
                                return key
                                    // Insert space before capital letters (camelCase to words)
                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                    // Replace underscores or hyphens with spaces
                                    .replace(/[_-]/g, ' ')
                                    // Title Case each word
                                    .split(' ')
                                    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                    .join(' ');
                            };

                            if (validSpecs.length > 0) {
                                return (
                                    <div className="pdp-specs-block">
                                        <h3>Specifications</h3>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="pdp-specs-table">
                                                <tbody>
                                                    {validSpecs.map(([key, value]) => (
                                                        <tr key={key}>
                                                            <th>{formatSpecKey(key)}</th>
                                                            <td>{value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Multi-Variant Complex Matrix Engine */}
                        <MatrixAccordion matrix={product.specifications_matrix} />
                    </div> {/* End of Extended Details Zone */}

                    {/* Related Products Injection */}
                    {relatedProducts.length > 0 && (
                        <div className="pdp-related-products">
                            <h2 className="related-title text-center" style={{ marginTop: '5rem', marginBottom: '2.5rem', fontSize: '1.75rem' }}>{relatedHeaderString}</h2>
                            <div className="catalog-grid">
                                {relatedProducts.map(relProduct => (
                                    <div key={relProduct.id} className="product-card">
                                        {relProduct.image ? (
                                            <a href={`/product/${relProduct.categorySlug}/${relProduct.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
                                                <div className="product-img" style={{ position: 'relative' }}>
                                                    <Image 
                                                        src={relProduct.image.startsWith('/') || relProduct.image.startsWith('http') || relProduct.image.startsWith('data:') ? relProduct.image : `/${relProduct.image}`} 
                                                        alt={relProduct.name} 
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </a>
                                        ) : (
                                            <a href={`/product/${relProduct.categorySlug}/${relProduct.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
                                                <div className="product-img product-img-placeholder">
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                    <span>Image Coming Soon</span>
                                                </div>
                                            </a>
                                        )}
                                        <div className="product-content">
                                            <a href={`/product/${relProduct.categorySlug}/${relProduct.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}>
                                                <h3 className="catalog-pdp-title-link">{relProduct.name}</h3>
                                            </a>
                                            <p className="product-desc" style={{ WebkitLineClamp: 3, lineClamp: 3 }}>{relProduct.short_description || relProduct.description}</p>
                                            <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                                                <a href={`/product/${relProduct.categorySlug}/${relProduct.slug}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', fontSize: '0.85rem' }}>View Details</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </>
    );
}
