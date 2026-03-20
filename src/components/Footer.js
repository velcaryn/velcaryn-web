import Image from 'next/image';

export default function Footer() {
    return (
        <footer>
            <div className="container footer-container">
                <div className="footer-brand">
                    <img src="/assets/VELCARYN-SVG.svg" alt="Velcaryn" className="footer-logo" />
                    <p>Global Export & Import Solutions.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#founders">Our Team</a></li>
                        <li><a href="#catalog">Catalog</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Connect</h4>
                    <p>info@velcaryn.com</p>
                    <p>+91 99447 88655</p>
                    <p>+91 99447 88165</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.8rem' }}>
                        <a href="https://www.instagram.com/velcaryn.group" target="_blank" style={{ color: 'var(--bg-white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom text-center">
                <p>&copy; {(new Date()).getFullYear()} Velcaryn LLP. All rights reserved.</p>
            </div>
        </footer>
    );
}
