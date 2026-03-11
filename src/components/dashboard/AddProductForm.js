"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

export default function AddProductForm({ categories: defaultCategories, initialData = null, draftId = null }) {
    const [categories, setCategories] = useState(defaultCategories);
    const [name, setName] = useState(initialData?.name || '');
    const [category, setCategory] = useState(initialData?.category || defaultCategories[0]?.id || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [isQuoteOnly, setIsQuoteOnly] = useState(initialData?.isQuoteOnly !== undefined ? initialData?.isQuoteOnly : false);
    const [existingImage, setExistingImage] = useState(initialData?.image || null);
    
    useEffect(() => {
        const savedCats = localStorage.getItem('velcaryn_draft_categories');
        if (savedCats) {
            const parsed = JSON.parse(savedCats);
            setCategories(parsed);
            setCategory(prev => (!parsed.some(c => c.id === prev) ? (parsed[0]?.id || '') : prev));
        }
    }, []);

    useEffect(() => {
        if (draftId && !initialData) {
            const drafts = JSON.parse(localStorage.getItem('velcaryn_drafts') || '[]');
            const draft = drafts.find(d => d.id === draftId);
            if (draft) {
                setName(draft.name || '');
                setCategory(draft.category || categories[0]?.id || '');
                setDescription(draft.description || '');
                setIsQuoteOnly(draft.isQuoteOnly || false);
                setExistingImage(draft.image || null);
            }
        }
    }, [draftId, initialData, categories]);

    // Image Cropping State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setCroppedImage(null); // Reset cropped image when new file selected
            setExistingImage(null); // clear existing image if they upload a new one
        }
    };

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImageBlobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(croppedImageBlobUrl);
            setImageSrc(null); // Close cropper
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels]);

    const handleSaveDraft = async () => {
        const idToSave = initialData?.id || Date.now().toString();
        const draft = { name, category, description, isQuoteOnly, image: croppedImage || existingImage, id: idToSave, isDraft: true };
        let existingDrafts = JSON.parse(localStorage.getItem('velcaryn_drafts') || '[]');
        
        // If editing an existing draft, update it instead of appending
        const draftIndex = existingDrafts.findIndex(d => d.id === idToSave);
        if (draftIndex >= 0) {
            existingDrafts[draftIndex] = draft;
        } else {
            existingDrafts.push(draft);
        }
        
        localStorage.setItem('velcaryn_drafts', JSON.stringify(existingDrafts));

        // If editing a live product directly, seamlessly remove it from the global catalog
        if (initialData && !initialData.isArchived && !draftId) {
            try {
                const res = await fetch('/api/github/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'REMOVE_FROM_LIVE',
                        payload: { productId: initialData.id },
                        commitMessage: `Dashboard: Converted Live Product ${name} to Draft`
                    })
                });
                
                if (!res.ok) {
                    console.warn("Could not remove from live, or it was already removed.");
                }
            } catch (e) {
                console.error("Failed to sync live removal", e);
            }
        }

        toast.success("Saved to local drafts!");
        setTimeout(() => {
            window.location.href = '/dashboard/drafts';
        }, 1000);
    };

    const handlePublish = async () => {
        if (!name || !category || !description) {
            toast.error("Please fill in all core product details before publishing.");
            return;
        }

        const isNewProduct = !initialData;
        const productId = initialData?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        if (isNewProduct && !croppedImage && !existingImage) {
            toast.error("Please crop and apply a product image before publishing.");
            return;
        }

        // If existingImage exists and NO croppedImage, we reuse the exact path (e.g. 'images/products/foo.png').
        // If croppedImage exists, we map it to our standardized directory tree.
        const resolvedImagePath = croppedImage ? `images/products/${productId}.png` : existingImage;

        const payload = {
            product: {
                id: productId,
                name,
                category,
                description,
                image: resolvedImagePath,
                isQuoteOnly
            },
            imageContentBase64: croppedImage // Null if they didn't upload a *new* image
        };

        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'UPDATE_PRODUCT',
                    payload,
                    commitMessage: `Dashboard: ${isNewProduct ? 'Create' : 'Modify'} Product ${name}`
                })
            });

            if (res.ok) {
                if (draftId) {
                    const drafts = JSON.parse(localStorage.getItem('velcaryn_drafts') || '[]');
                    localStorage.setItem('velcaryn_drafts', JSON.stringify(drafts.filter(d => d.id !== draftId)));
                }
                toast.success("Successfully synced product with the Velcaryn Network! ✔️");
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
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
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* Left Pane: Form */}
            <div style={{ flex: '1 1 50%', backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>{initialData ? 'Edit Product Details' : 'Product Details'}</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={60} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }} placeholder="e.g. Premium Foley Catheter" />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Short Description (Max 150 chars)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={150} rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }} placeholder="Write a concise 4-5 line description..." />
                    <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>{description.length}/150 characters</small>
                </div>

                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="quoteOnly" checked={isQuoteOnly} onChange={e => setIsQuoteOnly(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="quoteOnly" style={{ fontWeight: '500', cursor: 'pointer' }}>Available for Requesting Quote</label>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Image (1:1 Ratio Required)</label>
                    <input type="file" accept="image/*" onChange={onFileChange} style={{ marginBottom: '10px' }} />
                    
                    {imageSrc && (
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Force 1:1 aspect ratio
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                            <button onClick={showCroppedImage} style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '8px 16px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>Crop & Apply</button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button onClick={handleSaveDraft} style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save as Draft</button>
                    <button onClick={handlePublish} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Publish to Live</button>
                </div>

            </div>

            {/* Right Pane: Live Preview */}
            <div style={{ flex: '1 1 50%', minWidth: '400px', flexShrink: 0, position: 'sticky', top: '20px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Live Preview</h2>
                <div style={{ padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #adb5bd', display: 'flex', justifyContent: 'center' }}>
                    {/* Using exact CSS classes from main site for 1:1 fidelity */}
                    <div className="product-card" style={{ margin: '0', width: '100%', maxWidth: '350px' }}>
                        <div className="product-image-placeholder" style={{ backgroundColor: 'white', height: '200px', borderBottom: '1px solid #eee' }}>
                            {croppedImage || existingImage ? (
                                <img src={croppedImage || (existingImage.startsWith('data:') ? existingImage : `/${existingImage}`)} alt="Preview" className="product-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <span style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Upload image to preview</span>
                                </div>
                            )}
                        </div>
                        <div className="product-content">
                            <span className="product-category" style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                                {categories.find(c => c.id === category)?.name || 'Category'}
                            </span>
                            <h3 className="product-title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{name || 'Product Name Preview'}</h3>
                            <p className="product-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>{description || 'Your concise description will appear here. It should give a brief overview of the product.'}</p>
                            <div className="product-actions" style={{ marginTop: 'auto' }}>
                                {isQuoteOnly ? (
                                    <button className="btn btn-primary w-full" style={{ width: '100%' }} disabled>Request for a Quote</button>
                                ) : (
                                    <div style={{ height: '42px' }}></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
