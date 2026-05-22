import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const ClientSubmission = ({ currentUser, onSubmitBespokeRequest, cartCount }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [awardTitle, setAwardTitle] = useState('');
  const [category, setCategory] = useState('Corporate Awards');
  const [material, setMaterial] = useState('K9 Crystal');
  const [recipient, setRecipient] = useState('');
  const [dimension, setDimension] = useState('12" Elite');
  const [notes, setNotes] = useState('');

  // Protected Route Check
  if (!currentUser) {
    return (
      <div className="text-center py-5" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <i className="fa-solid fa-lock mb-4" style={{ fontSize: '64px', color: '#e4c24b' }}></i>
        <h2>Custom Order Form</h2>
        <p className="text-muted">You must log in to submit custom orders.</p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-outline-gold px-4" style={{ border: '1px solid #e4c24b', color: '#e4c24b' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && !awardTitle) {
      triggerNotification('Please fill out the Masterpiece Title.', 'error', 'Validation Warning');
      return;
    }
    if (currentStep === 2 && !recipient) {
      triggerNotification('Please enter a recipient name.', 'error', 'Validation Warning');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes) {
      triggerNotification('Please enter your design concept notes.', 'error', 'Validation Warning');
      return;
    }

    const requestData = {
      awardTitle,
      category,
      material,
      recipient,
      dimension,
      notes,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Approval',
      clientEmail: currentUser.email,
      clientName: currentUser.name
    };

    onSubmitBespokeRequest(requestData);
    triggerNotification('Thank you! Your custom order has been submitted. Our team will review it within 48 hours.', 'success', 'Bespoke Order Sent');
    navigate('/profile');
  };

  return (
    <>
      <style>{`
        .aurelian-custom-order-dark {
            background: #050505;
            color: #f5f1e8;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }

        .aurelian-custom-order-dark a {
            text-decoration: none;
        }

        .aurelian-header-dark {
            background: linear-gradient(180deg, #0c0c0c 0%, #090909 100%);
            border-bottom: 1px solid rgba(212, 175, 55, 0.12);
            padding: 18px 0;
        }

        .aurelian-logo-dark {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.6rem;
            font-weight: 700;
            font-style: italic;
            color: #d4af37;
            text-decoration: none;
            line-height: 1;
        }

        .aurelian-nav-dark .nav-link {
            color: rgba(255,255,255,0.85);
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1.8px;
            padding: 10px 18px;
            position: relative;
            font-weight: 500;
        }

        .aurelian-nav-dark .nav-link:hover,
        .aurelian-nav-dark .nav-link.active {
            color: #f0cc4d;
        }

        .aurelian-icon-links a {
            color: #f0cc4d;
            font-size: 18px;
            margin-left: 22px;
            text-decoration: none;
        }

        .custom-order-section-dark {
            padding: 70px 0 90px;
        }

        .custom-sidebar-dark h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 5rem;
            line-height: 0.95;
            font-weight: 700;
            margin-bottom: 30px;
            color: #f7f4ec;
            text-align: left;
        }

        .custom-sidebar-dark p.intro {
            font-size: 1.6rem;
            line-height: 1.9;
            color: rgba(255,255,255,0.78);
            margin-bottom: 60px;
            max-width: 460px;
            text-align: left;
        }

        .process-timeline-dark {
            position: relative;
            margin-bottom: 55px;
            text-align: left;
        }

        .process-timeline-dark::before {
            content: '';
            position: absolute;
            left: 5px;
            top: 10px;
            bottom: 10px;
            width: 1px;
            background: rgba(212,175,55,0.18);
        }

        .timeline-step-dark {
            position: relative;
            padding-left: 42px;
            margin-bottom: 48px;
        }

        .timeline-step-dark::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #d4af37;
            box-shadow: 0 0 10px rgba(212,175,55,0.45);
        }

        .timeline-step-dark h4 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.3rem;
            margin-bottom: 12px;
            font-weight: 700;
            color: #fff;
        }

        .timeline-step-dark p {
            font-size: 1.45rem;
            line-height: 1.8;
            color: rgba(255,255,255,0.72);
            max-width: 400px;
        }

        .custom-process-image-dark img {
            width: 100%;
            max-width: 420px;
            border-radius: 10px;
            object-fit: cover;
            box-shadow: 0 18px 40px rgba(0,0,0,0.45);
        }

        .custom-form-card-dark {
            background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
            border: 1px solid rgba(212,175,55,0.08);
            border-radius: 14px;
            padding: 42px 50px 46px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.55);
            text-align: left;
        }

        .form-steps-dark {
            display: flex;
            justify-content: space-between;
            margin-bottom: 45px;
        }

        .form-step-dark {
            text-align: center;
            flex: 1;
            position: relative;
        }

        .form-step-dark .circle {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 15px;
            border: 1px solid rgba(212,175,55,0.3);
            color: rgba(255,255,255,0.75);
            background: transparent;
        }

        .form-step-dark.active .circle {
            background: linear-gradient(135deg, #d4af37, #f3d55a);
            color: #111;
            border-color: #d4af37;
            box-shadow: 0 0 20px rgba(212,175,55,0.35);
        }

        .form-step-dark span {
            display: block;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.75);
        }

        .form-step-dark.active span {
            color: #f0cc4d;
        }

        .custom-form-card-dark label {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: rgba(255,255,255,0.9);
            display: block;
        }

        .custom-form-card-dark .form-control,
        .custom-form-card-dark .form-select {
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(212,175,55,0.12);
            border-radius: 0;
            padding: 18px 0;
            font-size: 1.7rem;
            color: #ffffff;
            box-shadow: none;
            outline: none;
            width: 100%;
        }

        .custom-form-card-dark select.form-select option {
            background: #111;
            color: #fff;
        }

        .custom-form-card-dark .form-control::placeholder {
            color: rgba(212,175,55,0.28);
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            font-weight: 600;
        }

        .custom-form-card-dark .form-control:focus,
        .custom-form-card-dark .form-select:focus {
            background: transparent;
            color: #fff;
            border-color: #d4af37;
            box-shadow: none;
        }

        .option-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .option-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(212,175,55,0.12);
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            display: flex;
            align-items: center;
            gap: 15px;
            color: rgba(255, 255, 255, 0.6);
        }

        .option-card:hover {
            background: rgba(212,175,55,0.05);
            border-color: rgba(212,175,55,0.4);
            transform: translateY(-3px);
            color: #fff;
        }

        .option-card.active {
            background: rgba(212,175,55,0.1);
            border-color: #d4af37;
            color: #d4af37;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(212,175,55,0.05);
            transform: translateY(-3px);
        }

        .option-card i {
            font-size: 24px;
            transition: all 0.3s ease;
        }

        .option-card.active i {
            transform: scale(1.15);
            color: #d4af37;
        }

        .option-card span {
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .form-divider-dark {
            height: 1px;
            background: rgba(212,175,55,0.08);
            margin: 35px 0;
        }

        .btn-next-step-dark {
            background: linear-gradient(90deg, #d4af37, #f0cc4d);
            color: #111;
            border: none;
            padding: 16px 42px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 0 25px rgba(212,175,55,0.25);
            transition: all .3s ease;
            cursor: pointer;
        }

        .btn-next-step-dark:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(212,175,55,0.35);
            color: #111;
        }

        .aurelian-footer-dark {
            border-top: 1px solid rgba(212,175,55,0.08);
            padding: 65px 0 50px;
            margin-top: 50px;
            background: #090909;
        }

        .footer-brand-dark h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.4rem;
            font-style: italic;
            color: #d4af37;
            margin-bottom: 18px;
            text-align: left;
        }

        .footer-brand-dark p {
            color: rgba(255,255,255,0.72);
            font-size: 1.5rem;
            line-height: 1.9;
            text-align: left;
        }

        .footer-title-dark {
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #f0cc4d;
            margin-bottom: 20px;
            font-weight: 600;
            text-align: left;
        }

        .footer-links-dark a {
            display: block;
            color: rgba(255,255,255,0.78);
            text-decoration: none;
            margin-bottom: 14px;
            font-size: 1.45rem;
            text-align: left;
        }

        .footer-links-dark a:hover {
            color: #f0cc4d;
        }

        .footer-bottom-dark {
            border-top: 1px solid rgba(212,175,55,0.06);
            margin-top: 45px;
            padding-top: 24px;
            color: rgba(255,255,255,0.5);
            font-size: 1.35rem;
        }

        @media (max-width: 991px) {
            .custom-sidebar-dark h1 {
                font-size: 3.6rem;
            }

            .custom-sidebar-dark {
                margin-bottom: 50px;
            }

            .custom-form-card-dark {
                padding: 32px 24px;
            }

            .form-steps-dark {
                gap: 10px;
            }

            .form-step-dark span {
                font-size: 10px;
                letter-spacing: 1px;
            }

            .custom-process-image-dark img {
                max-width: 100%;
            }
        }
      `}</style>

      <section className="aurelian-custom-order-dark">
        {/* HEADER */}
        <header className="aurelian-header-dark">
          <div className="container-fluid px-5">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="aurelian-logo-dark">Aurelian Trophies</Link>

              <nav className="navbar navbar-expand-lg p-0">
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item"><Link className="nav-link" to="/catalog">Catalog</Link></li>
                  <li className="nav-item"><Link className="nav-link active" to="/custom-order">Custom Order</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/about">About Heritage</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/profile">My Profile</Link></li>
                </ul>
              </nav>

              <div className="aurelian-icon-links d-flex align-items-center">
                <Link to="/profile"><i className="fa-regular fa-heart"></i></Link>
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="text-uppercase small ms-2 text-decoration-none text-light">Bag ({cartCount})</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN SECTION */}
        <section className="custom-order-section-dark">
          <div className="container-fluid px-5">
            <div className="row g-5">
              
              {/* LEFT SIDEBAR */}
              <div className="col-lg-4">
                <div className="custom-sidebar-dark">
                  <h1>Submit Your<br />Masterpiece</h1>

                  <p className="intro">
                    Transform your vision into a physical symbol of excellence.
                    Our master craftsmen await your custom design concepts for
                    review and meticulous creation.
                  </p>

                  <div className="process-timeline-dark">
                    <div className="timeline-step-dark">
                      <h4>01. Conceptual Review</h4>
                      <p>
                        Our design directors evaluate the structural integrity
                        and aesthetic alignment with the Aurelian brand within 48 hours.
                      </p>
                    </div>

                    <div className="timeline-step-dark">
                      <h4>02. Material Selection</h4>
                      <p>
                        Once approved, we coordinate with you to select premium
                        alloys, sustainable woods, or luxury K9 crystal mirror trims.
                      </p>
                    </div>

                    <div className="timeline-step-dark">
                      <h4>03. Handcrafted Production</h4>
                      <p>
                        The final masterpiece is forged and polished by hand,
                        ensuring a unique finish that lasts for generations.
                      </p>
                    </div>
                  </div>

                  <div className="custom-process-image-dark">
                    <img
                      src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=900&q=80"
                      alt="Craftsmanship"
                    />
                  </div>
                </div>
              </div>

              {/* FORM CARD */}
              <div className="col-lg-8">
                <div className="custom-form-card-dark">
                  {/* STEPS */}
                  <div className="form-steps-dark">
                    <div className={`form-step-dark ${currentStep >= 1 ? 'active' : ''}`}>
                      <div className="circle">1</div>
                      <span>Concept</span>
                    </div>
                    <div className={`form-step-dark ${currentStep >= 2 ? 'active' : ''}`}>
                      <div className="circle">2</div>
                      <span>Details</span>
                    </div>
                    <div className={`form-step-dark ${currentStep >= 3 ? 'active' : ''}`}>
                      <div className="circle">3</div>
                      <span>Options</span>
                    </div>
                  </div>

                  {/* STEP 1: CONCEPT */}
                  {currentStep === 1 && (
                    <form onSubmit={handleNext}>
                      <div className="mb-5">
                        <label>Masterpiece Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., The Zenith Achievement Award"
                          value={awardTitle}
                          onChange={(e) => setAwardTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label>Design Category</label>
                        <div className="option-grid">
                          {[
                            { name: 'Corporate Awards', icon: 'fa-building' },
                            { name: 'Sports Trophies', icon: 'fa-medal' },
                            { name: 'Academic Excellence', icon: 'fa-graduation-cap' },
                            { name: 'Luxury Medals', icon: 'fa-award' }
                          ].map(opt => (
                            <div 
                              key={opt.name}
                              className={`option-card ${category === opt.name ? 'active' : ''}`}
                              onClick={() => setCategory(opt.name)}
                            >
                              <i className={`fa-solid ${opt.icon}`}></i>
                              <span>{opt.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-divider-dark"></div>

                      <div className="text-end">
                        <button type="submit" className="btn-next-step-dark">
                          Next: Detail Settings
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 2: DETAILS */}
                  {currentStep === 2 && (
                    <form onSubmit={handleNext}>
                      <div className="mb-5">
                        <label>Trophy Material</label>
                        <div className="option-grid">
                          {[
                            { name: '24K Gold Inlays', icon: 'fa-coins' },
                            { name: 'K9 Optical Crystal', icon: 'fa-diamond' },
                            { name: 'Solid Obsidian Stone', icon: 'fa-cube' },
                            { name: 'Satin Platinum & Marble', icon: 'fa-chess-rook' }
                          ].map(opt => (
                            <div 
                              key={opt.name}
                              className={`option-card ${material === opt.name ? 'active' : ''}`}
                              onClick={() => setMaterial(opt.name)}
                            >
                              <i className={`fa-solid ${opt.icon}`}></i>
                              <span>{opt.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label>Registry Recipient Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Julian de Aurelian"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-divider-dark"></div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-secondary text-light px-4" onClick={handlePrev}>
                          Back
                        </button>
                        <button type="submit" className="btn-next-step-dark">
                          Next: Options
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: CURATION */}
                  {currentStep === 3 && (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-5">
                        <label>Exhibitor Scale / Dimension</label>
                        <div className="option-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
                          {[
                            { name: '10" Grand Edition', icon: 'fa-compress' },
                            { name: '12" Elite Edition', icon: 'fa-ruler-vertical' },
                            { name: '15" Apex Exhibition', icon: 'fa-expand' }
                          ].map(opt => (
                            <div 
                              key={opt.name}
                              className={`option-card ${dimension === opt.name ? 'active' : ''}`}
                              onClick={() => setDimension(opt.name)}
                            >
                              <i className={`fa-solid ${opt.icon}`}></i>
                              <span>{opt.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label>Masterpiece Concept & Custom Notes</label>
                        <textarea
                          rows="4"
                          className="form-control"
                          placeholder="Provide detailed description or engraving requests..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          required
                          style={{ background: 'transparent', borderBottom: '1px solid rgba(212,175,55,0.12)', color: '#fff' }}
                        />
                      </div>

                      <div className="form-divider-dark"></div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-secondary text-light px-4" onClick={handlePrev}>
                          Back
                        </button>
                        <button type="submit" className="btn-next-step-dark">
                          Initiate Submission
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="aurelian-footer-dark">
          <div className="container-fluid px-5">
            <div className="row g-5">
              <div className="col-lg-6">
                <div className="footer-brand-dark">
                  <h3>Aurelian Trophies</h3>
                  <p>
                    © 2026 Aurelian Trophies. Excellence in Craftsmanship.
                    We define achievement through precision and timeless aesthetic value.
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <h6 className="footer-title-dark">Resources</h6>
                <div className="footer-links-dark">
                  <Link to="/about">About</Link>
                  <Link to="/contact">Contact</Link>
                  <Link to="/about">FAQ</Link>
                </div>
              </div>

              <div className="col-lg-3">
                <h6 className="footer-title-dark">Legal</h6>
                <div className="footer-links-dark">
                  <Link to="/about">Privacy Policy</Link>
                  <Link to="/about">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default ClientSubmission;
