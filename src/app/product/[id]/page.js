"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ProductDetailPage({ params }) {
    const { id } = params;
    const router = useRouter();
    const { cart, addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const CATALOG_URL = process.env.NEXT_PUBLIC_CATALOG_URL || '/data/catalog.json';
                const res = await fetch(CATALOG_URL, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch catalog');
                const data = await res.json();
                
                const foundProduct = data.products.find(p => p.id === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                    const category = data.categories.find(c => c.id === foundProduct.category);
                    setCategoryName(category ? category.name : foundProduct.category);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                    <div className="loading-spinner"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <div style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                    <div className="container">
                        <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1rem' }}>Product Not Found</h2>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>We couldn't find the product you're looking for. It may have been removed or archived.</p>
                        <button onClick={() => router.push('/#catalog')} className="btn btn-primary">Return to Catalog</button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const inCart = cart.some(item => item.id === product.id);

    const handleQuoteAction = () => {
        if (!inCart) {
            addToCart(product);
        }
        router.push('/quote');
    };

    return (
        <>
            <Header />
            <div className="pdp-wrapper">
                <div className="container">
                    
                    <div className="pdp-breadcrumb">
                        <button onClick={() => router.push('/#catalog')} className="back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Catalog
                        </button>
                        <span className="separator">/</span>
                        <span className="current-category">{categoryName}</span>
                    </div>

                    <div className="pdp-grid">
                        
                        {/* Left Column: Image Gallery */}
                        <div className="pdp-image-container">
                            {product.image ? (
                                <img src={`/${product.image}`} alt={product.name} className="pdp-main-image" />
                            ) : (
                                <div className="pdp-placeholder-image">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                                    <span>Image Coming Soon</span>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Product Details & Actions */}
                        <div className="pdp-details-container">
                            <span className="pdp-badge">{categoryName}</span>
                            <h1 className="pdp-title">{product.name}</h1>
                            <p className="pdp-id">Product ID: <strong>{product.id}</strong></p>
                            
                            <div className="pdp-divider"></div>
                            
                            <div className="pdp-description-block">
                                <h3>Description</h3>
                                <p className="pdp-description">{product.description}</p>
                            </div>

                            {/* Optional Specifications Block - Currently rendered empty to be populated if data exists in future */}
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
                                    <button 
                                        className={`btn pdp-quote-btn ${inCart ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleQuoteAction}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        {inCart ? 'Proceed to Quote Cart' : 'Request a Quote'}
                                    </button>
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
