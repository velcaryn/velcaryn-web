"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';

export default function ProductActionClient({ product }) {
    const router = useRouter();
    const { cart, addToCart } = useCart();
    
    // Check if the current product is already in the cart context
    const inCart = cart.some(item => item.id === product.id);

    const handleQuoteAction = () => {
        if (!inCart) {
            addToCart(product);
        }
        router.push('/quote');
    };

    return (
        <button 
            className={`btn pdp-quote-btn ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleQuoteAction}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {inCart ? 'Proceed to Quote Cart' : 'Request a Quote'}
        </button>
    );
}
