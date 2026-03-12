"use client";
import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useCart } from '../../context/CartContext';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { State } from 'country-state-city';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function QuotePage() {
    const { cart, removeFromCart, clearCart } = useCart();
    const router = useRouter();

    const getFlagEmoji = (countryCode) => {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    const options = useMemo(() => {
        return countryList().getData().map(country => ({
            ...country,
            label: `${getFlagEmoji(country.value)} ${country.label}`
        }));
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: null,
        region: null,
        regionText: '',
        subject: '',
        message: ''
    });

    const statesForCountry = useMemo(() => {
        if (!formData.country?.value) return [];
        return State.getStatesOfCountry(formData.country.value.toUpperCase()).map(state => ({
            value: state.isoCode,
            label: state.name
        }));
    }, [formData.country]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error("Please select at least one item before requesting a quote.");
            return;
        }

        if (!formData.phone || formData.phone.length < 5) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        if (!formData.country) {
            toast.error("Please select a valid country.");
            return;
        }

        if (!formData.subject) {
            toast.error("Please enter a subject.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const itemsList = cart.map(item => `- ${item.name} (${item.category})`).join('\n');

            const templateParams = {
                first_name: formData.firstName,
                last_name: formData.lastName || 'N/A',
                email: formData.email,
                phone_number: formData.phone,
                country: formData.country?.label || 'Unknown',
                region: formData.region?.label || formData.regionText || 'N/A',
                subject: formData.subject,
                message: formData.message,
                requested_items: itemsList,
                total_items: cart.length
            };

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
            );

            setSubmitSuccess(true);
            clearCart();
            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (error) {
            console.error('FAILED...', error);
            setSubmitError('Something went wrong sending your request. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <>
                <Header />
                <div style={{ paddingTop: '160px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '50px 40px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '1px solid #eee' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Request Sent!</h2>
                        <p style={{ color: '#6b7280', marginBottom: '30px', lineHeight: '1.6' }}>We have received your quote request and will be in touch with you shortly at <strong>{formData.email}</strong>.</p>
                        <button onClick={() => router.push('/#catalog')} style={{ padding: '12px 24px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                            Explore More Products
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div style={{ paddingTop: '150px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'inherit' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>

                    <div style={{ marginBottom: '24px' }}>
                        <a href="/#catalog" style={{ textDecoration: 'none', color: '#6b7280', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '15px', padding: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Catalog
                        </a>
                    </div>

                    <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '2px solid var(--primary-color)', overflow: 'hidden' }}>

                        {/* Top Side: Cart Items */}
                        <div style={{ background: '#f8fafc', padding: '24px 32px', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 0 }}>Selected Items</h3>
                                <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '13px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>{cart.length} Items</span>
                            </div>

                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0', border: '1px dashed #d1d5db', borderRadius: '8px', background: 'white' }}>
                                    Your quote list is empty. Explore the catalog to add items.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                    {cart.map(item => (
                                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', position: 'relative' }}>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                                title="Remove item"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                            <div style={{ width: '64px', height: '64px', backgroundColor: '#f8fafc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                                                {item.image ? (
                                                    <img src={`/${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                                ) : (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                                                )}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0', lineHeight: '1.3' }}>{item.name}</h4>
                                                <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom Side: Form */}
                        <div className="responsive-padding" style={{ backgroundColor: 'white' }}>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)', margin: '0 0 8px 0' }}>Request a Quote</h2>
                                <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>Fill out your details below and our team will get back to you with pricing immediately.</p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="responsive-grid-2">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>First Name / Company <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            type="text"
                                            required
                                            style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="Enter name or company"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Last Name</label>
                                        <input
                                            type="text"
                                            style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div className="responsive-grid-2">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            type="email"
                                            required
                                            style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@company.com"
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                                        <div style={{ width: '100%' }}>
                                            <PhoneInput
                                                country={''}
                                                enableSearch={true}
                                                value={formData.phone}
                                                onChange={(phone, data) => {
                                                    setFormData(prev => {
                                                        let newCountry = prev.country;
                                                        let region = prev.region;
                                                        let regionText = prev.regionText;
                                                        if (data && data.countryCode) {
                                                            const foundCountry = options.find(c => c.value.toLowerCase() === data.countryCode.toLowerCase());
                                                            if (foundCountry && (!prev.country || prev.country.value !== foundCountry.value)) {
                                                                newCountry = foundCountry;
                                                                region = null;
                                                                regionText = '';
                                                            }
                                                        }
                                                        return { ...prev, phone, country: newCountry, region, regionText };
                                                    });
                                                }}
                                                inputStyle={{ width: '100%', height: '46px', borderRadius: '6px', borderColor: '#d1d5db', fontSize: '15px' }}
                                                buttonStyle={{ borderColor: '#d1d5db', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', backgroundColor: '#f9fafb' }}
                                                containerStyle={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="responsive-grid-2" style={{ position: 'relative', zIndex: 10 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Country <span style={{ color: '#ef4444' }}>*</span></label>
                                        <Select
                                            options={options}
                                            value={formData.country}
                                            onChange={country => setFormData({ ...formData, country, region: null, regionText: '' })}
                                            placeholder="Select your country..."
                                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                            classNamePrefix="react-select"
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '46px',
                                                    borderRadius: '6px',
                                                    borderColor: '#d1d5db',
                                                    fontSize: '15px',
                                                })
                                            }}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 9 }}>
                                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Region / State</label>
                                        {statesForCountry.length > 0 ? (
                                            <Select
                                                options={statesForCountry}
                                                value={formData.region}
                                                onChange={region => setFormData({ ...formData, region, regionText: '' })}
                                                placeholder="Select region/state..."
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                classNamePrefix="react-select"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9998 }),
                                                    control: (base) => ({
                                                        ...base,
                                                        minHeight: '46px',
                                                        borderRadius: '6px',
                                                        borderColor: '#d1d5db',
                                                        fontSize: '15px',
                                                    })
                                                }}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                                value={formData.regionText}
                                                onChange={e => setFormData({ ...formData, regionText: e.target.value, region: null })}
                                                placeholder="Enter your region or state"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Subject <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="text"
                                        required
                                        style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Order Inquiry, Custom Quote, etc."
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Message</label>
                                    <div style={{ background: 'white', borderRadius: '6px' }}>
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.message}
                                            onChange={message => setFormData({ ...formData, message })}
                                            style={{ height: '150px', marginBottom: '40px' }}
                                            placeholder="Type your message here..."
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px', paddingTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {submitError && (
                                        <div style={{ padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                                            {submitError} <br />
                                            <a href="/#contact" style={{ fontWeight: 'bold', textDecoration: 'underline', color: '#991b1b', marginTop: '8px', display: 'inline-block' }}>Click here to contact us directly</a>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary"
                                        style={{ width: '100%', maxWidth: '280px', padding: '16px 24px', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                                        {!isSubmitting && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
