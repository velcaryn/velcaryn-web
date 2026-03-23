import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductActionClient from './ProductActionClient';

// Direct data ingest into the server runtime for zero-latency hydration
import catalogData from '../../../../public/data/catalog.json';

// Advanced Next.js API: Generate Dynamic SEO & Open Graph Tags
export async function generateMetadata({ params }) {
    // Next.js 15+ mandates awaiting the params object
    const { id } = await params;
    
    const product = catalogData.products.find(p => p.id === id);
    if (!product) {
        return {
            title: 'Product Not Found | Velcaryn',
        };
    }

    const category = catalogData.categories.find(c => c.id === product.category);
    const categoryName = category ? category.name : product.category;

    // Craft a highly compelling description, capped at recommended ~150 chars
    const shortDescription = product.description.length > 150 
        ? product.description.substring(0, 150) + '...'
        : product.description;

    return {
        title: `${product.name} | Velcaryn Products`,
        description: shortDescription,
        openGraph: {
            title: `${product.name} | Velcaryn`,
            description: shortDescription,
            images: [
                {
                    // Prefix the absolute domain for deep linking
                    url: `https://www.velcaryn.com/${product.image}`, 
                    alt: product.name,
                    width: 800,
                    height: 600,
                }
            ],
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
    const { id } = await params;
    
    // Server-side lookup
    const product = catalogData.products.find(p => p.id === id);
    
    if (!product) {
        notFound();
    }

    const category = catalogData.categories.find(c => c.id === product.category);
    const categoryName = category ? category.name : product.category;

    return (
        <>
            <Header />
            <div className="pdp-wrapper">
                <div className="container">
                    
                    <div className="pdp-breadcrumb">
                        <a href="/#catalog" className="back-link" style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Catalog
                        </a>
                        <span className="separator">/</span>
                        <span className="current-category">{categoryName}</span>
                    </div>

                    <div className="pdp-grid">
                        
                        {/* Left Column: Image Gallery */}
                        <div className="pdp-image-container" style={{ position: 'relative' }}>
                            {product.image ? (
                                <Image 
                                    src={`/${product.image}`} 
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

                        {/* Right Column: Server-rendered Product Details */}
                        <div className="pdp-details-container">
                            <span className="pdp-badge">{categoryName}</span>
                            <h1 className="pdp-title">{product.name}</h1>
                            <p className="pdp-id">Product ID: <strong>{product.id}</strong></p>
                            
                            <div className="pdp-divider"></div>
                            
                            <div className="pdp-description-block">
                                <h3>Description</h3>
                                <p className="pdp-description">{product.description}</p>
                            </div>

                            {/* Specifications Engine */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="pdp-specs-block">
                                    <h3>Specifications</h3>
                                    <ul className="pdp-specs-list">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <li key={key}>
                                                <span className="spec-key">{key}:</span>
                                                <span className="spec-value">{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
