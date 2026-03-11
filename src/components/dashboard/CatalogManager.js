"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './catalog-manager.css'; // Add grid styles here

// Draggable Product Block Component
function SortableProductCard({ product, catName, onArchive }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.15)' : '',
  };

  return (
    <div ref={setNodeRef} style={style} className={`product-card draggable-card ${isDragging ? 'dragging' : ''}`}>
      {/* Drag Handle Top Bar */}
      <div 
        className="drag-handle-bar" 
        {...attributes} 
        {...listeners}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 9H10V11H8V9ZM14 9H16V11H14V9ZM8 13H10V15H8V13ZM14 13H16V15H14V13Z" fill="#adb5bd"/>
        </svg>
        <span style={{ fontSize: '0.75rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '1px' }}>Drag to Reorder</span>
      </div>

      <div className="product-image-placeholder" style={{ backgroundColor: 'white' }}>
          {product.image ? (
              <img src={`/${product.image}`} alt={product.name} className="product-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
          ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#adb5bd', fontSize: '0.9rem' }}>No Image</span>
              </div>
          )}
      </div>
      
      <div className="product-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span className="product-category" style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>{catName}</span>
          <h3 className="product-title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{product.name}</h3>
          <p className="product-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', flex: 1 }}>{product.description}</p>
          
          <div className="product-actions" style={{ marginTop: 'auto', paddingTop: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <Link onPointerDown={(e) => e.stopPropagation()} href={`/dashboard/add?productId=${product.id}`} className="btn btn-primary w-full" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px 0', fontSize: '0.9rem' }}>
                      Edit
                  </Link>
                  <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onArchive(product.id, product.name)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', color: '#495057', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      Archive
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

// Main Manager Controller
export default function CatalogManager({ initialProducts, categories }) {
    const [products, setProducts] = useState(initialProducts);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px tolerance until drag starts so clicks on buttons still work
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setProducts((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const moveToTop = (id) => {
        const index = products.findIndex(p => p.id === id);
        if (index === 0) return;
        const newProducts = [...products];
        const item = newProducts.splice(index, 1)[0];
        newProducts.unshift(item);
        setProducts(newProducts);
    };

    const handleArchive = async (productId, productName) => {
        if (!confirm(`Are you sure you want to archive "${productName}"? It will be removed from the live website.`)) return;
        
        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'ARCHIVE_PRODUCT',
                    payload: { productId },
                    commitMessage: `Dashboard: Archive Product ${productName}`
                })
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== productId));
                toast.success("Successfully archived product! It has been removed from the Live Catalog.");
            } else {
                const data = await res.json();
                toast.error(`Error: ${data.error || 'Pipeline execution fault'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network timeout. Check browser console.");
        }
    };

    const handleSaveOrder = async () => {
        try {
            const res = await fetch('/api/github/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'REORDER_CATALOG',
                    payload: { products },
                    commitMessage: 'Dashboard: Reorder Catalog Grid'
                })
            });

            if (res.ok) {
                toast.success("Successfully published new catalog order to Live Site!");
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
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    onClick={handleSaveOrder} 
                    style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                    Publish New Order to Live Site
                </button>
            </div>

            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="exact-four-column-grid">
                    <SortableContext 
                        items={products.map(p => p.id)}
                        strategy={rectSortingStrategy}
                    >
                        {products.map((product) => {
                            const catName = categories.find(c => c.id === product.category)?.name || product.category;
                            return (
                                <div key={product.id} className="draggable-wrapper">
                                    {/* Hover Action to jump to position 1 immediately */}
                                    <button 
                                        className="to-top-btn" 
                                        onClick={() => moveToTop(product.id)}
                                        title="Move straight to Position #1"
                                    >
                                        Jump to Top 1
                                    </button>
                                    <SortableProductCard 
                                        product={product} 
                                        catName={catName}
                                        onArchive={handleArchive} 
                                    />
                                </div>
                            );
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
}
