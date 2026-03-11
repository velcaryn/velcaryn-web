"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CategoriesClient({ initialCategories }) {
    const [categories, setCategories] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('velcaryn_draft_categories');
            if (saved) return JSON.parse(saved);
        }
        return initialCategories;
    });
    const [newCatId, setNewCatId] = useState('');
    const [newCatName, setNewCatName] = useState('');

    useEffect(() => {
        localStorage.setItem('velcaryn_draft_categories', JSON.stringify(categories));
    }, [categories]);

    const handleAdd = () => {
        if (!newCatId || !newCatName) return;
        const newCategory = { id: newCatId.toLowerCase().replace(/\s+/g, '_'), name: newCatName };
        setCategories([...categories, newCategory]);
        setNewCatId('');
        setNewCatName('');
    };

    const handleDelete = (idToRemove) => {
        // Prevent deleting the required 'all' category
        if (idToRemove === 'all') return;
        setCategories(categories.filter(c => c.id !== idToRemove));
    };

    const handlePublish = async () => {
        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'UPDATE_CATEGORIES',
                    payload: { categories },
                    commitMessage: 'Dashboard: Update Category Schema'
                })
            });

            if (res.ok) {
                toast.success("Successfully published category architecture to Live Site!");
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Current Categories</h2>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {categories.map(cat => (
                        <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid #f8f9fa' }}>
                            <div>
                                <strong style={{ display: 'block' }}>{cat.name}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>ID: {cat.id}</span>
                            </div>
                            {cat.id !== 'all' && (
                                <button onClick={() => handleDelete(cat.id)} style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Add New Category</h2>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Display Name</label>
                        <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }} placeholder="e.g. Dental Supplies" />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Internal ID</label>
                        <input type="text" value={newCatId} onChange={e => setNewCatId(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }} placeholder="e.g. dental_supplies" />
                    </div>

                    <button onClick={handleAdd} style={{ width: '100%', padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Append to List</button>
                </div>

                <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffe69c' }}>
                    <h3 style={{ color: '#664d03', marginBottom: '10px', fontSize: '1rem' }}>Commit Changes</h3>
                    <p style={{ color: '#664d03', fontSize: '0.9rem', marginBottom: '15px' }}>Any appended or removed categories will not affect the live website until explicitly published to the upstream repository.</p>
                    <button onClick={handlePublish} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Category Architecture</button>
                </div>
            </div>
        </div>
    );
}
