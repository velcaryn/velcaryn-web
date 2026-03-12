"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileActive, setMobileActive] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const { cart, isLoaded } = useCart();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleQuoteClick = () => {
        setMobileActive(false);
        setIsNavigating(true);
        setTimeout(() => {
            router.push('/quote');
            setIsNavigating(false);
        }, 1000);
    };

    return (
        <header id="header" className={scrolled ? 'scrolled' : ''}>
            <div className="container header-container">
                <div className="logo">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>velcaryn</span>
                    </Link>
                </div>

                <button className={`mobile-menu-btn ${mobileActive ? 'active' : ''}`} onClick={() => setMobileActive(!mobileActive)} aria-label="Toggle Navigation">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <nav className={`main-nav ${mobileActive ? 'active' : ''}`}>
                    <ul>
                        <li><Link href="/#hero" onClick={() => setMobileActive(false)}>Home</Link></li>
                        <li><Link href="/#about" onClick={() => setMobileActive(false)}>About</Link></li>
                        <li><Link href="/#services" onClick={() => setMobileActive(false)}>Services</Link></li>
                        <li><Link href="/#catalog" onClick={() => setMobileActive(false)}>Products</Link></li>
                        <li>
                            {isLoaded && cart.length > 0 ? (
                                <>
                                    <button onClick={handleQuoteClick} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit' }} disabled={isNavigating}>
                                        <span>{isNavigating ? 'Loading...' : 'Request Quote'}</span>
                                        <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{cart.length}</span>
                                    </button>
                                </>
                            ) : (
                                <Link href="/#contact" className="btn btn-primary" onClick={() => setMobileActive(false)}>
                                    Contact Us
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
