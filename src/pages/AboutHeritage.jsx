import React from 'react';
import { Link } from 'react-router-dom';

const AboutHeritage = ({ cartCount }) => {
  return (
    <>
      <style>{`
        .onyx-page {
            background: #050505;
            color: #f5f1e8;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }

        .site-header {
            border-bottom: 1px solid rgba(255,255,255,.07);
            background: #080808;
        }

        .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 46px;
            font-weight: 700;
            color: #d4af37;
            text-decoration: none;
        }

        .onyx-page .nav-link {
            color: #d5d5d5 !important;
            font-size: 15px;
            font-weight: 500;
            margin: 0 12px;
            text-transform: uppercase;
        }

        .onyx-page .nav-link:hover,
        .onyx-page .nav-link.active {
            color: #d4af37 !important;
        }

        .header-icons a {
            color: #d4af37;
            margin-left: 22px;
            font-size: 20px;
        }

        .onyx-hero {
            position: relative;
            padding: 140px 0 160px;
            background:
                radial-gradient(circle at center, rgba(141,108,0,.22), transparent 55%),
                #050505;
            text-align: center;
        }

        .onyx-kicker {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #d4af37;
            margin-bottom: 24px;
        }

        .onyx-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 92px;
            line-height: .9;
            font-weight: 700;
            color: #fff;
            margin-bottom: 28px;
            text-shadow: 0 4px 10px rgba(0,0,0,.55);
        }

        .onyx-title .gold {
            color: #d4af37;
        }

        .onyx-subtitle {
            max-width: 760px;
            margin: 0 auto;
            font-size: 17px;
            line-height: 2;
            color: rgba(255,255,255,.75);
        }

        .hero-divider {
            width: 1px;
            height: 80px;
            background: linear-gradient(to bottom, transparent, #d4af37, transparent);
            margin: 90px auto 0;
        }

        .onyx-story {
            padding: 120px 0;
        }

        .onyx-image {
            position: relative;
        }

        .onyx-image img {
            width: 100%;
            display: block;
            object-fit: cover;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .corner-line {
            position: absolute;
            right: -20px;
            bottom: -20px;
            width: 120px;
            height: 120px;
            border-right: 1px solid #8a6b00;
            border-bottom: 1px solid #8a6b00;
        }

        .onyx-section-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 64px;
            line-height: .95;
            color: #fff;
            margin-bottom: 28px;
            text-align: left;
        }

        .onyx-text {
            font-size: 16px;
            line-height: 2;
            color: rgba(255,255,255,.75);
            margin-bottom: 20px;
            text-align: left;
        }

        .btn-onyx {
            background: linear-gradient(90deg, #b58d00, #d4af37);
            border: none;
            color: #fff;
            padding: 14px 34px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 10px 24px rgba(0,0,0,.25);
            cursor: pointer;
            transition: opacity 0.3s ease;
        }

        .btn-onyx:hover {
            color: #fff;
            opacity: .96;
        }

        .onyx-foundation {
            padding: 110px 0;
            border-top: 1px solid rgba(255,255,255,.06);
            border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .foundation-heading {
            font-family: 'Cormorant Garamond', serif;
            font-size: 52px;
            color: #fff;
            margin-bottom: 40px;
            position: relative;
            display: inline-block;
        }

        .foundation-heading::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -12px;
            width: 70px;
            height: 2px;
            background: #d4af37;
        }

        .foundation-card {
            background: #0c0c0c;
            border: 1px solid rgba(255,255,255,.06);
            position: relative;
            overflow: hidden;
            height: 100%;
        }

        .foundation-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .foundation-content {
            position: absolute;
            inset: auto 0 0 0;
            padding: 26px;
            background: linear-gradient(to top, rgba(0,0,0,.88), transparent);
            text-align: left;
        }

        .foundation-kicker {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #d4af37;
            margin-bottom: 8px;
        }

        .foundation-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 34px;
            color: #fff;
            margin-bottom: 10px;
        }

        .foundation-text {
            font-size: 14px;
            line-height: 1.8;
            color: rgba(255,255,255,.75);
        }

        .foundation-mini {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 250px;
            padding: 40px 30px;
        }

        .foundation-mini i {
            font-size: 22px;
            color: #d4af37;
            margin-bottom: 18px;
        }

        .foundation-mini h5 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 30px;
            color: #fff;
            margin-bottom: 10px;
        }

        .foundation-mini p {
            margin: 0;
            font-size: 14px;
            line-height: 1.8;
            color: rgba(255,255,255,.7);
        }

        .onyx-quote {
            padding: 110px 0;
            text-align: center;
        }

        .onyx-quote-mark {
            font-size: 48px;
            color: #d4af37;
            margin-bottom: 28px;
        }

        .onyx-quote-text {
            max-width: 900px;
            margin: 0 auto 30px;
            font-family: 'Cormorant Garamond', serif;
            font-size: 54px;
            line-height: 1.4;
            font-style: italic;
            color: #fff;
        }

        .onyx-quote-author {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #d4af37;
        }

        .onyx-curator {
            padding: 110px 0 130px;
            border-top: 1px solid rgba(255,255,255,.06);
        }

        .curator-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 58px;
            color: #fff;
            margin-bottom: 28px;
            text-align: left;
        }

        .curator-text {
            font-size: 16px;
            line-height: 2;
            color: rgba(255,255,255,.75);
            margin-bottom: 28px;
            text-align: left;
        }

        .curator-signature {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #d4af37;
            text-align: left;
        }

        .curator-image img {
            width: 100%;
            display: block;
            object-fit: cover;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .site-footer {
            margin-top: 100px;
            border-top: 1px solid rgba(255,255,255,.05);
            padding: 80px 0 25px;
            background: #040404;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 72px;
            font-weight: 700;
            color: #d4af37;
            text-align: left;
        }

        .footer-text {
            color: #a8a8a8;
            line-height: 1.8;
            margin-top: 20px;
            text-align: left;
        }

        .footer-title {
            color: #d4af37;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 18px;
            text-align: left;
        }

        .footer-links a {
            display: block;
            color: #d4d4d4;
            text-decoration: none;
            margin-bottom: 12px;
            text-align: left;
        }

        .footer-links a:hover {
            color: #d4af37;
        }

        .footer-bottom {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,.04);
            color: #666;
            font-size: 13px;
        }

        @media (max-width: 991px) {
            .onyx-title {
                font-size: 56px;
            }

            .onyx-section-title,
            .foundation-heading,
            .curator-title {
                font-size: 42px;
            }

            .onyx-quote-text {
                font-size: 34px;
            }

            .corner-line {
                display: none;
            }
        }
      `}</style>

      <section className="onyx-page">
        {/* HEADER */}
        <header className="site-header py-3">
          <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="brand">Aurelian</Link>

              <nav className="d-none d-lg-flex align-items-center">
                <Link to="/catalog" className="nav-link">Catalog</Link>
                <Link to="/custom-order" className="nav-link">Client Submission</Link>
                <Link to="/about" className="nav-link active">About Heritage</Link>
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </nav>

              <div className="d-flex align-items-center header-icons">
                <Link to="/profile"><i className="fa-regular fa-user"></i></Link>
                <Link to="/cart">
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span className="ms-1" style={{ fontSize: '12px' }}>Bag ({cartCount})</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="onyx-hero">
          <div className="container">
            <div className="onyx-kicker">The Onyx Philosophy</div>

            <h1 className="onyx-title">
              Crafting Immortality in<br />
              <span className="gold">Gold and Obsidian.</span>
            </h1>

            <p className="onyx-subtitle">
              Aurelian is more than a trophy house. We are the custodians of
              victory, sculpting the tangible weight of achievement for the
              world's most elite pioneers.
            </p>

            <div className="hero-divider"></div>
          </div>
        </section>

        {/* STORY */}
        <section className="onyx-story">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-5">
                <div className="onyx-image">
                  <img
                    src="https://imgs.search.brave.com/kLVkOSoEfJlrKh-liajefV0bj1eJuuuPh0CSK1LF6V8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M3LzNi/LzA4L2M3M2IwOGNj/ZjIyYTJhNGVmMTgw/ZDYzNTNlMDBjNmQ4/LmpwZw"
                    alt="The Alchemy of Excellence"
                  />
                  <div className="corner-line"></div>
                </div>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <h2 className="onyx-section-title">
                  The Alchemy of Excellence
                </h2>

                <p className="onyx-text">
                  Founded in the silent halls of tradition, the Onyx Edition
                  represents our ultimate pursuit of contrast. We believe
                  true glory is defined against the void.
                </p>

                <p className="onyx-text">
                  Every piece is a spiritual refinement. It must hold the
                  silence of the room before the applause.
                </p>

                <Link to="/catalog">
                  <button className="btn btn-onyx mt-3">
                    Explore the Atelier
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDATION */}
        <section className="onyx-foundation">
          <div className="container">
            <h2 className="foundation-heading">Our Foundation</h2>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="foundation-card" style={{ height: '380px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80"
                    alt="Material Sincerity"
                  />

                  <div className="foundation-content">
                    <div className="foundation-kicker">Pillar I</div>
                    <div className="foundation-title">Material Sincerity</div>
                    <div className="foundation-text">
                      We source only ethical metals and geological
                      rarities that stand the test of centuries.
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="row g-4 h-100">
                  <div className="col-12">
                    <div className="foundation-card foundation-mini">
                      <div>
                        <i className="fa-solid fa-trophy"></i>
                        <h5>Heritage Grade</h5>
                        <p>
                          A legacy spanning three generations of
                          master goldsmiths.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="foundation-card foundation-mini">
                      <div>
                        <i className="fa-solid fa-star"></i>
                        <h5>Bespoke Ritual</h5>
                        <p>Tailored to the winner's soul.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="foundation-card foundation-mini">
                      <div>
                        <i className="fa-solid fa-globe"></i>
                        <h5>Global Presence</h5>
                        <p>Delivered to the world's podiums.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="onyx-quote">
          <div className="container">
            <div className="onyx-quote-mark">❝</div>

            <blockquote className="onyx-quote-text">
              “Aurelian doesn't make awards. They make monuments to
              human willpower.”
            </blockquote>

            <div className="onyx-quote-author">
              Marcus Aurelius V
            </div>
          </div>
        </section>

        {/* CURATOR */}
        <section className="onyx-curator">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h2 className="curator-title">The Curator's Vision</h2>

                <p className="curator-text">
                  “When we designed the Onyx Edition, we weren't looking
                  at trophies. We were looking at black holes, at the
                  night's sky over the Alps, and the quiet resolve of
                  champions.”
                </p>

                <div className="curator-signature">
                  Julian Thorne, Lead Curator
                </div>
              </div>

              <div className="col-lg-5 offset-lg-1">
                <div className="curator-image">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80"
                    alt="Lead Curator"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="container-fluid px-5">
            <div className="row g-5">
              <div className="col-lg-6">
                <div className="footer-brand">Aurelian</div>
                <p className="footer-text">
                  Defining the standard of achievement through master-crafted
                  trophies and bespoke recognition awards.
                </p>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Navigation</div>
                <div className="footer-links">
                  <Link to="/catalog">Collections</Link>
                  <Link to="/custom-order">Custom Process</Link>
                  <Link to="/about">Our Heritage</Link>
                  <Link to="/contact">Contact Expert</Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Support</div>
                <div className="footer-links">
                  <Link to="/contact">Contact Expert</Link>
                  <Link to="/contact">Shipping & Returns</Link>
                  <Link to="/about">F.A.Q</Link>
                  <Link to="/about">Privacy Policy</Link>
                </div>
              </div>
            </div>

            <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
              <div>© 2026 Aurelian Trophies. Excellence in Craftsmanship.</div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default AboutHeritage;
