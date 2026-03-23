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
                    <div className="footer-social-panel">
                        <a href="https://www.instagram.com/velcaryn.group" target="_blank" style={{ color: 'var(--bg-white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram
                        </a>
                        <a href="https://www.linkedin.com/company/velcaryn/" target="_blank" style={{ color: 'var(--bg-white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
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
