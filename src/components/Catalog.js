"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Catalog() {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [navigatingId, setNavigatingId] = useState(null);
    const router = useRouter();

    const { cart, addToCart, removeFromCart } = useCart();

    const CATALOG_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://raw.githubusercontent.com/velcaryn/velcaryn-web/main/public/data/catalog.json'
        : '/data/catalog.json';

    useEffect(() => {
        fetch(CATALOG_URL, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                setAllProducts(data.products);
                setCategories(data.categories);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const isCartEmpty = cart.length === 0;

    return (
        <section id="catalog" className="section section-white">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Product Catalog</h2>
                    <div className="divider"></div>
                    <p>Browse our extensive range of import and export commodities.</p>
                </div>

                <div className="catalog-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            id="catalog-search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <select
                            id="catalog-category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div id="catalog-grid" className="catalog-grid">
                    {loading ? (
                        <div className="loading-state">Loading catalog...</div>
                    ) : filtered.length === 0 ? (
                        <div className="no-results">No products found matching your criteria.</div>
                    ) : (
                        filtered.map(product => {
                            const catName = categories.find(c => c.id === product.category)?.name || product.category;
                            const inCart = cart.some(item => item.id === product.id);

                            let buttonText;
                            let buttonAction;

                            if (isCartEmpty) {
                                buttonText = "Request for a Quote";
                                buttonAction = () => addToCart(product);
                            } else if (inCart) {
                                buttonText = navigatingId === product.id ? "Loading..." : "Request Quote";
                                buttonAction = () => {
                                    setNavigatingId(product.id);
                                    setTimeout(() => {
                                        router.push('/quote');
                                    }, 1000);
                                };
                            } else {
                                buttonText = "Add";
                                buttonAction = () => addToCart(product);
                            }

                            return (
                                <div key={product.id} className="product-card" style={inCart ? { border: '2px solid var(--primary-color)', position: 'relative', transform: 'translateY(-4px)', boxShadow: '0 12px 20px rgba(0,0,0,0.1)' } : {}}>
                                    {inCart && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }}
                                            style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 6px rgba(239, 68, 68, 0.4)' }}
                                            title="Remove selection"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    )}
                                    {product.image ? (
                                        <div className="product-img"><img src={`/${product.image}`} alt={product.name} loading="lazy" /></div>
                                    ) : (
                                        <div className="product-img product-img-placeholder">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <span>Image Coming Soon</span>
                                        </div>
                                    )}
                                    <div className="product-content">
                                        <span className="product-category">{catName}</span>
                                        <h3>{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                                            {product.isQuoteOnly ? (
                                                <button
                                                    className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'}`}
                                                    style={{ width: '100%', fontSize: '0.85rem' }}
                                                    onClick={buttonAction}
                                                >
                                                    {buttonText}
                                                </button>
                                            ) : (
                                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', visibility: 'hidden', pointerEvents: 'none' }}>EmptySpace</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
