import Image from 'next/image';

export default function Footer() {
    return (
        <footer>
            <div className="container footer-container">
                <div className="footer-brand">
                    <img src="/assets/logo.png" alt="Velcaryn" className="footer-logo" />
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
                </div>
            </div>
            <div className="footer-bottom text-center">
                <p>&copy; {(new Date()).getFullYear()} Velcaryn. All rights reserved.</p>
            </div>
        </footer>
    );
}
