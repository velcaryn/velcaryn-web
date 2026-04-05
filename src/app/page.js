import Header from '../components/Header';
import Catalog from '../components/Catalog';
import Footer from '../components/Footer';
import Founders from '../components/Founders';

export default function Home() {
  return (
    <>
      <Header />

      <section id="hero" className="hero">
        <video 
           autoPlay 
           loop 
           muted 
           playsInline 
           className="hero-video-bg"
           poster="/assets/VELCARYN-SVG.svg"
           preload="none"
        >
          <source src="/assets/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Connect. Trade. Grow.<br /><span>The expert way</span></h1>
            <p>Velcaryn is your trusted partner for compliant trade across borders. Expert selection of products at its highest quality to meet buyer expectations everytime.</p>
            <div className="hero-buttons">
              <a href="#catalog" className="btn btn-primary btn-lg">Explore Catalog</a>
              <a href="#about" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
          </div>
          <div className="hero-logo-watermark">
            <img src="/assets/VELCARYN-SVG.svg" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="about" className="section section-white">
        <div className="container">
          <div className="section-header text-center">
            <h2>About Velcaryn</h2>
            <div className="divider"></div>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <h3>Excellence in Global Trade</h3>
              <p>At Velcaryn, we bridge the gap between global demand and superior supply. With years of expertise in international business and medical field, we ensure that your goods reach their destination safely, securely, and on time.</p>
              <p>Our commitment to reliability and transparency has made us a preferred partner for businesses looking to expand their footprint in the global marketplace.</p>
            </div>
            <div className="about-visual">
              <div className="visual-box compliance-box">
                <span className="stat-label">Compliance</span>
                <span className="stat-label">Quality</span>
                <span className="stat-label">Reliability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section section-purple">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Services</h2>
            <div className="divider divider-light"></div>
            <p>Comprehensive solutions for your international business needs.</p>
          </div>
          <div className="services-grid">
            <div className="service-card text-center">
              <div className="service-icon">⚕️</div>
              <h3>Expert Sourcing</h3>
              <p>Strategic sourcing of high-quality goods with first hand experience to international markets, maximizing your global reach and profitability.</p>
            </div>
            <div className="service-card text-center">
              <div className="service-icon">💼</div>
              <h3>Product Consulting</h3>
              <p>Provide end to end consulting on the product catalog for the buyer to understand the item quality and function better and make informed order decisions</p>
            </div>
            <div className="service-card text-center">
              <div className="service-icon">📤</div>
              <h3>Global Export</h3>
              <p>End-to-end management of shipping, freight forwarding, and complex customs clearance processes to guarantee smooth transit.</p>
            </div>
          </div>
        </div>
      </section>

      <Catalog />

      <Founders />

      <section id="contact" className="section section-cta text-center">
        <div className="container contact-container">
          <img src="/assets/VELCARYN-SVG.svg" alt="Velcaryn" className="contact-logo" />
          <h2>Ready to expand your global reach?</h2>
          <p>Contact the Velcaryn team today to discuss your specific export and import requirements.</p>
          <div className="contact-phones">
            <a href="tel:+919944788655" className="phone-link">📞 +91 99447 88655</a>
            <a href="tel:+919944788165" className="phone-link">📞 +91 99447 88165</a>
          </div>
          <a href="mailto:info@velcaryn.com" className="btn btn-cta btn-lg mt-2">Contact Our Team</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
