"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ArchivesClient({ initialArchives }) {
    const [archives, setArchives] = useState(initialArchives);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleUnarchive = async (productId, productName) => {
        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'UNARCHIVE_PRODUCT',
                    payload: { productId },
                    commitMessage: `Dashboard: Unarchive Product ${productName}`
                })
            });

            if (res.ok) {
                setArchives(archives.filter(p => p.id !== productId));
                setSelectedIds(prev => prev.filter(id => id !== productId));
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

    const handleDelete = async (productIds) => {
        if (!confirm(`Are you sure you want to permanently delete ${productIds.length} item(s)? This cannot be undone.`)) return;

        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'DELETE_ARCHIVED_PRODUCTS',
                    payload: { productIds },
                    commitMessage: `Dashboard: Permanently Deleted ${productIds.length} Archived Product(s)`
                })
            });

            if (res.ok) {
                setArchives(archives.filter(p => !productIds.includes(p.id)));
                setSelectedIds(prev => prev.filter(id => !productIds.includes(id)));
                toast.success(`Successfully deleted ${productIds.length} item(s) from Archives.`);
            } else {
                const data = await res.json();
                toast.error(`Error: ${data.error || 'Pipeline execution fault'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network timeout. Check browser console.");
        }
    };

    const toggleSelection = (productId) => {
        setSelectedIds(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    return (
        <div>
            {selectedIds.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffe69c', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#664d03', fontWeight: 'bold' }}>{selectedIds.length} item(s) selected</span>
                    <button onClick={() => handleDelete(selectedIds)} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Delete Selected Permanently
                    </button>
                </div>
            )}

            {archives.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                    <p style={{ color: 'var(--text-muted)' }}>You have no archived products.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {archives.map(product => (
                        <div key={product.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(product.id)}
                                    onChange={() => toggleSelection(product.id)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                {product.image ? (
                                    <img src={`/${product.image}`} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.6 }} loading="lazy" />
                                ) : (
                                    <span style={{ color: '#adb5bd' }}>No Image</span>
                                )}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--text-main)' }}>{product.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Category: {product.category}</p>
                            
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={() => handleDelete([product.id])} style={{ padding: '8px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                <Link href={`/dashboard/add?archiveId=${product.id}`} style={{ padding: '8px', backgroundColor: '#e9ecef', color: '#333', border: '1px solid #ced4da', borderRadius: '4px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' }}>Edit</Link>
                                <button onClick={() => handleUnarchive(product.id, product.name)} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Restore</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
