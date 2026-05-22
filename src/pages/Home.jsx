import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ cartCount, onAddToCart, featuredProducts, navigateTo }) => {
  const scrollRef = useRef(null);
  const targetScrollRef = useRef(0);

  useEffect(() => {
    let animationId;
    
    if (scrollRef.current) {
      targetScrollRef.current = scrollRef.current.scrollLeft;
    }

    const scrollStep = () => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        // A single group of 4 cards (320px + 24px gap) = 1376px
        const loopWidth = 1376;

        targetScrollRef.current += 1.5; // Always auto-scroll

        if (targetScrollRef.current >= loopWidth) {
          targetScrollRef.current -= loopWidth;
          scrollContainer.scrollLeft -= loopWidth;
        } else if (targetScrollRef.current < 0) {
          targetScrollRef.current += loopWidth;
          scrollContainer.scrollLeft += loopWidth;
        }

        const diff = targetScrollRef.current - scrollContainer.scrollLeft;
        let adjustedDiff = diff;
        
        if (adjustedDiff > loopWidth / 2) adjustedDiff -= loopWidth;
        if (adjustedDiff < -loopWidth / 2) adjustedDiff += loopWidth;

        if (Math.abs(adjustedDiff) > 0.5) {
          scrollContainer.scrollLeft += adjustedDiff * 0.1;
        } else {
          scrollContainer.scrollLeft = targetScrollRef.current;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    animationId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleScrollLeft = () => {
    targetScrollRef.current -= 344;
  };

  const handleScrollRight = () => {
    targetScrollRef.current += 344;
  };

  return (
    <>
      <style>{`
        /* =========================================================
           GLOBAL STYLES & LUXURY VARIABLES
        ========================================================= */
        .aurelian-home {
            background: #050505;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            width: 100%;
        }

        .aurelian-home a {
            text-decoration: none;
        }

        .aurelian-home img {
            max-width: 100%;
            display: block;
        }

        /* Gold Theme Colors */
        :root {
            --gold: #e3c44c;
            --gold-dark: #caa22a;
            --gold-light: #f6dc76;
            --dark: #050505;
            --card: #0f0f10;
            --border: rgba(227, 196, 76, 0.12);
            --text-muted: rgba(255, 255, 255, 0.72);
        }

        /* Header styles are now globally inherited from App.jsx */

        /* =========================================================
           HERO
        ========================================================= */
        .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: 
                linear-gradient(rgba(5, 5, 5, 0.6), rgba(5, 5, 5, 0.85)),
                url('https://as1.ftcdn.net/v2/jpg/06/00/16/46/1000_F_600164644_pAo3gPzXntrpn8owlDRauMsCEXaGqLO8.jpg') center/cover no-repeat fixed;
            padding-top: 80px; /* Offset for fixed header */
        }

        .hero-section .container-fluid {
            position: relative;
            z-index: 2;
        }

        .section-kicker {
            color: var(--gold);
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 22px;
            display: inline-block;
            border-bottom: 1px solid var(--gold);
            padding-bottom: 6px;
        }

        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 7.5rem;
            line-height: 0.95;
            font-weight: 700;
            margin-bottom: 30px;
            text-shadow: 0 10px 30px rgba(0,0,0,0.8);
            background: linear-gradient(180deg, #fff 0%, #d4d4d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-title em {
            background: linear-gradient(90deg, var(--gold-light), var(--gold-dark));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-style: italic;
        }

        .hero-description {
            color: rgba(255,255,255,0.85);
            font-size: 1.6rem;
            line-height: 1.9;
            max-width: 700px;
            margin: 0 auto 40px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .btn-gold {
            background: linear-gradient(90deg, var(--gold-dark), var(--gold-light));
            border: none;
            color: #111;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 16px 30px;
            border-radius: 0;
            box-shadow: 0 10px 35px rgba(227,196,76,0.18);
        }

        .btn-gold:hover {
            color: #111;
            opacity: 0.95;
        }

        .btn-outline-gold {
            border: 1px solid var(--gold);
            color: var(--gold);
            background: transparent;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 16px 30px;
            border-radius: 0;
            transition: all 0.3s ease;
        }

        .btn-outline-gold:hover {
            background: var(--gold);
            color: #111;
        }

        .hero-image {
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }

        /* =========================================================
           SECTION TITLE
        ========================================================= */
        .section-title-wrap {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.8rem;
            margin-bottom: 10px;
        }

        .section-subtitle {
            color: rgba(255,255,255,0.75);
            font-size: 1.45rem;
        }

        .gold-divider {
            width: 80px;
            height: 2px;
            background: var(--gold);
            margin: 18px auto 0;
        }

        /* =========================================================
           CATEGORY MARQUEE & CARDS
        ========================================================= */
        .marquee-wrapper {
            overflow-x: hidden;
            width: 100%;
            display: flex;
            gap: 24px;
            padding: 10px 0;
            position: relative;
            scrollbar-width: none;
        }
        
        .marquee-wrapper::-webkit-scrollbar {
            display: none;
        }

        .marquee-group {
            display: flex;
            gap: 24px;
            flex-shrink: 0;
        }

        .carousel-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(10, 10, 10, 0.8);
            color: #d4af37;
            border: 1px solid #d4af37;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s ease, background 0.3s ease, color 0.3s ease;
        }

        .carousel-btn-left {
            left: 20px;
        }

        .carousel-btn-right {
            right: 20px;
        }

        .marquee-container:hover .carousel-btn {
            opacity: 1;
        }

        .carousel-btn:hover {
            background: #d4af37;
            color: #111;
        }

        .category-card {
            position: relative;
            overflow: hidden;
            background: #111;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            width: 320px;
            flex-shrink: 0;
        }

        .category-card img {
            width: 100%;
            height: 380px;
            object-fit: cover;
            transition: transform 0.8s ease;
        }

        .category-card:hover {
            border-color: var(--gold);
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .category-card:hover img {
            transform: scale(1.08);
        }

        .category-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%);
            display: flex;
            align-items: flex-end;
            padding: 24px;
        }

        .category-name {
            font-size: 1.6rem;
            color: #fff;
            margin-bottom: 6px;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
            transition: color 0.3s ease;
        }

        .category-card:hover .category-name {
            color: var(--gold);
        }

        .category-tag {
            font-size: 11px;
            font-weight: 700;
            color: var(--gold);
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        /* =========================================================
           PRODUCT CARDS
        ========================================================= */
        .product-card {
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .product-card:hover {
            transform: translateY(-8px);
            border-color: rgba(227,196,76,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .product-image {
            position: relative;
            background: #111;
            padding: 20px;
            text-align: center;
        }

        .product-image img {
            width: 100%;
            height: 280px;
            object-fit: contain;
            transition: transform 0.5s ease;
        }

        .product-card:hover .product-image img {
            transform: scale(1.08);
        }

        .product-body {
            padding: 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .product-category {
            font-size: 11px;
            color: rgba(255,255,255,0.5);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
        }

        .product-title {
            font-size: 1.8rem;
            font-family: 'Cormorant Garamond', serif;
            margin: 0 0 16px;
            color: #fff;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .product-card:hover .product-title {
            color: var(--gold);
        }

        .product-price {
            color: var(--gold);
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
        }

        /* =========================================================
           MANUFACTURING SECTION
        ========================================================= */
        .manufacturing-section {
            padding: 120px 0;
        }

        .manufacturing-image {
            position: relative;
        }

        .manufacturing-image img {
            width: 100%;
            height: 500px;
            object-fit: cover;
        }

        .since-badge {
            position: absolute;
            right: 0;
            bottom: 0;
            background: var(--gold);
            color: #111;
            padding: 18px 26px;
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 2rem;
        }

        .feature-list {
            list-style: none;
            padding: 0;
            margin: 30px 0;
        }

        .feature-list li {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            color: rgba(255,255,255,0.82);
            font-size: 1.5rem;
        }

        .feature-list i {
            color: var(--gold);
            margin-right: 14px;
        }

        /* =========================================================
           FOOTER
        ========================================================= */
        .aurelian-footer {
            background: #050505;
            border-top: 1px solid rgba(255,255,255,0.04);
            padding: 80px 0 30px;
        }

        .footer-logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.6rem;
            color: var(--gold);
            margin-bottom: 18px;
        }

        .footer-text {
            color: rgba(255,255,255,0.68);
            font-size: 1.45rem;
            line-height: 1.9;
        }

        .footer-heading {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #fff;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .footer-links a {
            display: block;
            color: rgba(255,255,255,0.72);
            margin-bottom: 12px;
            font-size: 1.4rem;
        }

        .newsletter-input {
            position: relative;
        }

        .newsletter-input input {
            width: 100%;
            background: rgba(255,255,255,0.06);
            border: none;
            color: #fff;
            padding: 14px 42px 14px 16px;
        }

        .newsletter-input button {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--gold);
        }

        .footer-bottom {
            margin-top: 55px;
            padding-top: 24px;
            border-top: 1px solid rgba(255,255,255,0.04);
            color: rgba(255,255,255,0.45);
            font-size: 1.3rem;
        }

        .footer-social a {
            color: rgba(255,255,255,0.75);
            margin-left: 18px;
        }

        /* =========================================================
           SPACING
        ========================================================= */
        .section-space {
            padding: 100px 0;
            overflow: hidden;
        }

        /* =========================================================
           RESPONSIVE
        ========================================================= */
        @media (max-width: 991px) {
            .hero-title {
                font-size: 4.6rem;
            }

            .search-box {
                display: none;
            }

            .section-space,
            .manufacturing-section {
                padding: 70px 0;
            }
        }
      `}</style>

      <section className="aurelian-home">


        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container-fluid px-4 px-lg-5">
            <div className="section-kicker">Legacy of Achievement</div>
            
            <h1 className="hero-title">
              Excellence<br />
              <em>Rendered in Gold</em>
            </h1>

            <p className="hero-description">
              Custom manufacturing for the best quality trophies. 
              From corporate milestones to athletic triumphs, we craft the 
              physical embodiment of victory.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/catalog" className="btn btn-gold">Explore Collection</Link>
              <Link to="/custom-order" className="btn btn-outline-gold">Custom Design</Link>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY SECTION ================= */}
        <section className="section-space">
          <div className="container-fluid px-4 px-lg-5">
            <div className="d-flex justify-content-between align-items-end mb-5">
              <div>
                <div className="section-kicker">Selection</div>
                <h2 className="section-title mb-0">Shop by Category</h2>
              </div>
              <Link to="/catalog" className="view-all-link small text-uppercase">View All Categories</Link>
            </div>

            <div className="marquee-container position-relative">
              <button className="carousel-btn carousel-btn-left" onClick={handleScrollLeft}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <div className="marquee-wrapper" ref={scrollRef}>
                {[1, 2, 3, 4].map((groupIndex) => (
                  <div className="marquee-group" aria-hidden={groupIndex > 1} key={groupIndex}>
                    <div className="category-card" onClick={() => window.location.href='/catalog'}>
                      <img src="https://imgs.search.brave.com/wped5r2LYVGyol1UXrMdD2RXZmjLsSHcwCpOik6yrEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/NjAyMzY1L3Bob3Rv/L3dpbm5lcnMtdHJv/cGhpZXMuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVByaFdw/OE5fQmRFMDU5eWVv/QmFuX2RZRDhPR0tG/Y0JMVVY0eGN0dm5C/TkU9" alt="Corporate Awards" />
                      <div className="category-overlay">
                        <div>
                          <div className="category-name">Corporate Awards</div>
                          <div className="category-tag">Recognition for Leadership</div>
                        </div>
                      </div>
                    </div>
                    <div className="category-card" onClick={() => window.location.href='/catalog'}>
                      <img src="https://imgs.search.brave.com/gUe-1L-vJ0PyF7vBDop-FDkC2LYOWhR0XOos6opz_KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAw/Mzc1MzYxLTAwMS9w/aG90by9hc3NvcnRl/ZC10cm9waGllcy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/TlBBQjZTSjZ3eHVz/c3BzWVM2cktJbWxa/NVlZeGNZbzBhV0hi/TWlEeW1aYz0" alt="Sports Trophies" />
                      <div className="category-overlay">
                        <div>
                          <div className="category-name">Sports Trophies</div>
                          <div className="category-tag">Champion's Choice</div>
                        </div>
                      </div>
                    </div>
                    <div className="category-card" onClick={() => window.location.href='/catalog'}>
                      <img src="https://imgs.search.brave.com/RaJZVIalv-LSUyW9KpyK4y6nTHkmye0HtNfHkDmlAWE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTYv/MzYzLzMwMC9zbWFs/bC9jbG9zZS11cC12/aWV3LW9mLWdvbGQt/c2lsdmVyLWFuZC1i/cm9uemUtbWVkYWxz/LXdpdGgtY29sb3Jm/dWwtcmliYm9ucy1k/aXNwbGF5ZWQtb24t/YS13aGl0ZS1iYWNr/Z3JvdW5kLXBob3Rv/LmpwZw" alt="Custom Medals" />
                      <div className="category-overlay">
                        <div>
                          <div className="category-name">Custom Medals</div>
                          <div className="category-tag">Honoring Milestones</div>
                        </div>
                      </div>
                    </div>
                    <div className="category-card" onClick={() => window.location.href='/catalog'}>
                      <img src="https://imgs.search.brave.com/0u9kD9iJJsRYxygwe4-xtELdB2ZYefnjX18ZViNv06c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE1/NzU1MTUzNy9waG90/by93aW5uZXJzLWN1/cC1zeW1ib2xpemlu/Zy12aWN0b3J5LWFu/ZC1zdWNjZXNzLWlu/LWNvbXBldGl0aW9u/cy1maXJzdC1wbGFj/ZS1wcml6ZS10cm9w/aHktZm9yLndlYnA_/YT0xJmI9MSZzPTYx/Mng2MTImdz0wJms9/MjAmYz03SnZ2VGhJ/MGFfMlVQbWYxRkVt/Q2taaVhzR2M0ZDY4/ZzR5eUVZSUUxcXkw/PQ" alt="Bespoke Cups" />
                      <div className="category-overlay">
                        <div>
                          <div className="category-name">Custom Cups</div>
                          <div className="category-tag">Heritage Collection</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="carousel-btn carousel-btn-right" onClick={handleScrollRight}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}
        <section className="section-space pt-0">
          <div className="container-fluid px-4 px-lg-5">
            <div className="section-title-wrap">
              <div className="section-kicker">The Aurelian Selection</div>
              <h2 className="section-title">Excellence in Craftsmanship</h2>
              <div className="gold-divider"></div>
            </div>

            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div className="col-md-6 col-lg-3" key={product.id}>
                  <div className="product-card">
                    <div className="product-image">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} />
                      </Link>
                    </div>
                    <div className="product-body">
                      <div>
                        <div className="product-category">{product.category}</div>
                        <h4 className="product-title">{product.name}</h4>
                      </div>
                      <div>
                        <div className="product-price">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <button className="btn btn-outline-gold w-100" onClick={() => onAddToCart(product)}>
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MANUFACTURING ================= */}
        <section className="manufacturing-section">
          <div className="container-fluid px-4 px-lg-5">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <div className="manufacturing-image">
                  <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                    alt="Craftsmanship" />
                  <div className="since-badge">Since 1924</div>
                </div>
              </div>

              <div className="col-lg-5 offset-lg-1">
                <div className="section-kicker">Custom Manufacturing</div>
                <h2 className="section-title">The Aurelian Standard</h2>

                <p className="hero-description mb-4">
                  Our master craftsmen combine traditional gold-smithing
                  techniques with contemporary industrial design to create
                  awards that are not just prizes, but heirlooms of history.
                </p>

                <ul className="feature-list">
                  <li><i className="fa-solid fa-medal"></i>24-Karat Gold Plating Guarantee</li>
                  <li><i className="fa-solid fa-ruler-combined"></i>Precision CNC Geometric Accuracy</li>
                  <li><i className="fa-solid fa-pen-ruler"></i>Complimentary Design Consulting</li>
                </ul>

                <Link to="/custom-order" className="btn btn-outline-gold">Request a Consultation</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="aurelian-footer">
          <div className="container-fluid px-4 px-lg-5">
            <div className="row g-5">
              <div className="col-lg-3">
                <div className="footer-logo">Aurelian Trophies</div>
                <p className="footer-text">
                  Elevating recognition through superior craftsmanship and timeless design.
                </p>
              </div>

              <div className="col-lg-2">
                <div className="footer-heading">Collections</div>
                <div className="footer-links">
                  <Link to="/catalog">The Signature Gold</Link>
                  <Link to="/catalog">Modern Crystalline</Link>
                  <Link to="/catalog">Heritage Bronze</Link>
                  <Link to="/catalog">Custom One-offs</Link>
                </div>
              </div>

              <div className="col-lg-2">
                <div className="footer-heading">Navigation</div>
                <div className="footer-links">
                  <Link to="/about">About Us</Link>
                  <Link to="/contact">Contact</Link>
                  <Link to="/catalog">Catalog</Link>
                  <Link to="/admin">Admin Console</Link>
                
                </div>
              </div>

              <div className="col-lg-3">
                <div className="footer-heading">Newsletter</div>
                <p className="footer-text mb-3">
                  Subscribe for exclusive collection launches.
                </p>

                <div className="newsletter-input">
                  <input type="email" placeholder="Your email address" />
                  <button><i className="fa-solid fa-arrow-right"></i></button>
                </div>
              </div>

              <div className="col-lg-2 d-flex align-items-end justify-content-lg-end">
                <div className="footer-social">
                  <a href="#globe"><i className="fa-solid fa-globe"></i></a>
                  <a href="#share"><i className="fa-solid fa-share-nodes"></i></a>
                  <a href="#msg"><i className="fa-regular fa-message"></i></a>
                </div>
              </div>
            </div>

            <div className="footer-bottom d-flex justify-content-between flex-wrap">
              <span>© 2026 Aurelian Trophies. Excellence in Craftsmanship.</span>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Home;
