"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DraftsPage() {
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        const savedDrafts = JSON.parse(localStorage.getItem('velcaryn_drafts') || '[]');
        setDrafts(savedDrafts);
    }, []);

    const handleDelete = (id) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== id);
        localStorage.setItem('velcaryn_drafts', JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
    };

    const handlePublish = async (draft) => {
        if (!draft.name || !draft.category || !draft.description) {
            toast.error("Draft is missing required core details. Please 'Edit' the draft to complete it before publishing.");
            return;
        }

        if (!draft.image) {
            toast.error("Draft is missing an image. Please 'Edit' the draft to upload and crop one before publishing.");
            return;
        }

        const productId = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const resolvedImagePath = `images/products/${productId}.png`;

        const payload = {
            product: {
                id: productId,
                name: draft.name,
                category: draft.category,
                description: draft.description,
                image: resolvedImagePath,
                isQuoteOnly: draft.isQuoteOnly || false
            },
            imageContentBase64: draft.image
        };

        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'UPDATE_PRODUCT',
                    payload,
                    commitMessage: `Dashboard: Publish Draft ${draft.name}`
                })
            });

            if (res.ok) {
                handleDelete(draft.id);
                toast.success("Successfully synced product with the Velcaryn Network! ✔️");
            } else {
                const data = await res.json();
                toast.error(`Error: ${data.error || 'Pipeline execution fault'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network timeout. Check browser console.");
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>Saved Drafts</h1>
                <p>Manage your unpublished product drafts stored securely in your browser cache.</p>
            </div>

            {drafts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>You have no saved drafts.</p>
                    <Link href="/dashboard/add" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        Create New Product
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {drafts.map((draft) => (
                        <div key={draft.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', backgroundColor: 'white' }}>
                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                {draft.image ? (
                                    <img src={draft.image} alt={draft.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ color: '#adb5bd' }}>No Image Crop</span>
                                )}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--text-main)' }}>{draft.name || 'Untitled Draft'}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Category: {draft.category}</p>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleDelete(draft.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                <Link href={`/dashboard/add?draftId=${draft.id}`} style={{ flex: 1, padding: '8px', backgroundColor: '#e9ecef', color: '#333', border: '1px solid #ced4da', borderRadius: '4px', textAlign: 'center', textDecoration: 'none', fontWeight: '500' }}>Edit</Link>
                                <button onClick={() => handlePublish(draft)} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Publish</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
