"use client";
import React, { useState } from 'react';

export default function MatrixAccordion({ matrix }) {
    // Dictionary tracking independent open/close states mapped logically to array indexes
    const [openGroups, setOpenGroups] = useState({});

    const toggleGroup = (idx) => {
        setOpenGroups(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    if (!matrix || !matrix.headers) return null;

    return (
        <div className="pdp-specs-block accordion-matrix-block">
            <h3>Configuration Technical Data</h3>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="pdp-matrix-table">
                    <thead>
                        <tr>
                            {matrix.headers.map((header, idx) => (
                                <th key={`head-${idx}`}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.groups.map((group, grpIdx) => {
                            const isOpen = !!openGroups[grpIdx];
                            return (
                                <React.Fragment key={`group-${grpIdx}`}>
                                    {/* Interactive Dropdown Mapping Structure */}
                                    <tr 
                                        className={`accordion-header-row ${isOpen ? 'is-open' : ''}`}
                                        onClick={() => toggleGroup(grpIdx)}
                                        style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    >
                                        <td colSpan={matrix.headers.length} className="pdp-matrix-group-header" style={{ padding: '0.85rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <span style={{ fontWeight: 'bold' }}>{group.groupName}</span>
                                                <svg 
                                                    style={{ 
                                                        transition: 'transform 0.3s ease', 
                                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        color: '#64748b'
                                                    }} 
                                                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Physically rendering dependent matrix payload conditionally */}
                                    {isOpen && group.rows.map((row, rowIdx) => (
                                        <tr key={`row-${grpIdx}-${rowIdx}`} className="accordion-content-row" style={{ animation: 'fadeInRow 0.3s ease-in-out' }}>
                                            {row.map((cell, cellIdx) => (
                                                <td key={`cell-${cellIdx}`}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
