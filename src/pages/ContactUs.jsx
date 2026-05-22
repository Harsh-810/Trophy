import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const ContactUs = ({ cartCount, onAddInquiry }) => {
  const { triggerNotification } = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Trophies');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !name || !email) {
      triggerNotification('Please fill out all required fields.', 'error', 'Validation Warning');
      return;
    }

    if (onAddInquiry) {
      await onAddInquiry({ name, email, subject, message });
    }

    triggerNotification(`Thank you, ${name}. Your private concierge inquiry regarding "${subject}" has been successfully logged. An expert curator will reach out shortly.`, 'success', 'Concierge Inquiry Logged');
    setMessage('');
    setName('');
    setEmail('');
  };

  return (
    <>
      <style>{`
        .aurelian-portal-contact {
            background: #050505;
            color: #f5f1e8;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .aurelian-portal-contact a {
            text-decoration: none;
        }

        /* Removed local header styling to use global App.jsx dark nav */

        .portal-contact-section {
            padding: 70px 0 90px;
            background: #050505;
        }

        .section-label {
            font-size: 13px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #e8c54f;
            font-weight: 600;
            margin-bottom: 24px;
            text-align: left;
        }

        .portal-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 7rem;
            line-height: 0.92;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0;
            text-align: left;
        }

        .portal-description {
            font-size: 1.75rem;
            line-height: 1.9;
            color: rgba(255,255,255,0.78);
            max-width: 520px;
            text-align: left;
        }

        .portal-divider {
            height: 1px;
            background: rgba(232,197,79,0.12);
            margin: 50px 0 65px;
        }

        .inquiry-card {
            border: 1px solid rgba(232,197,79,0.08);
            background: #070707;
            padding: 42px;
            height: 100%;
            text-align: left;
        }

        .inquiry-card h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.4rem;
            color: #ffffff;
            margin-bottom: 35px;
        }

        .form-label-luxury {
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
            color: rgba(255,255,255,0.7);
            margin-bottom: 10px;
            display: block;
        }

        .inquiry-card .form-control,
        .inquiry-card .form-select,
        .inquiry-card textarea {
            background: #111112;
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 0;
            color: #ffffff;
            font-size: 1.5rem;
            padding: 14px 16px;
            box-shadow: none;
            width: 100%;
            outline: none;
        }

        .inquiry-card .form-select {
            background-color: transparent;
            color: #ffffff;
            border: none;
            border-bottom: 1px solid rgba(232,197,79,0.12);
            padding: 14px 0;
        }

        .inquiry-card .form-select option {
            color: #000;
        }

        .inquiry-card textarea {
            background: #060606;
            border: 1px solid rgba(232,197,79,0.08);
            color: #bfc6d2;
            min-height: 150px;
            padding: 18px;
        }

        .btn-gold {
            background: linear-gradient(90deg, #e8c54f, #f2d765);
            border: none;
            color: #111;
            padding: 16px 34px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            box-shadow: 0 8px 30px rgba(232,197,79,0.22);
            transition: all .3s ease;
            cursor: pointer;
        }

        .btn-gold:hover {
            color: #111;
            transform: translateY(-2px);
        }

        .info-card {
            background: linear-gradient(180deg, #1b1b1d 0%, #151515 100%);
            padding: 42px;
            border: 1px solid rgba(232,197,79,0.06);
            margin-bottom: 24px;
            text-align: left;
        }

        .info-card h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.2rem;
            color: #f0cc4d;
            margin-bottom: 30px;
        }

        .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 18px;
            margin-bottom: 32px;
        }

        .contact-item i {
            color: #f0cc4d;
            font-size: 20px;
            margin-top: 4px;
            width: 22px;
        }

        .contact-item h6 {
            font-size: 1.6rem;
            color: #ffffff;
            margin-bottom: 6px;
            font-weight: 600;
        }

        .contact-item p {
            font-size: 1.45rem;
            line-height: 1.7;
            color: rgba(255,255,255,0.72);
            margin: 0;
        }

        .map-card {
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(232,197,79,0.06);
        }

        .map-card img {
            width: 100%;
            display: block;
            height: 320px;
            object-fit: cover;
            filter: brightness(0.45);
        }

        .map-status {
            position: absolute;
            left: 20px;
            bottom: 20px;
            background: rgba(0,0,0,0.75);
            border: 1px solid rgba(232,197,79,0.25);
            color: #ffffff;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 10px 16px;
        }

        .map-status .dot {
            width: 8px;
            height: 8px;
            background: #f0cc4d;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }

        .global-ateliers {
            margin-top: 65px;
            text-align: left;
        }

        .global-ateliers h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.8rem;
            color: #ffffff;
            margin-bottom: 30px;
        }

        .atelier-row {
            border-top: 1px solid rgba(232,197,79,0.08);
            padding-top: 30px;
        }

        .atelier-title {
            color: #f0cc4d;
            font-weight: 600;
            font-size: 1.8rem;
            margin-bottom: 10px;
        }

        .atelier-address {
            color: rgba(255,255,255,0.72);
            font-size: 1.45rem;
            line-height: 1.7;
        }

        .region-label {
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.55);
            text-align: right;
        }

        /* Removed local footer styling */

        @media (max-width: 991px) {
            .portal-title {
                font-size: 4.6rem;
                margin-bottom: 30px;
            }

            .portal-description {
                max-width: 100%;
            }

            .inquiry-card,
            .info-card {
                padding: 28px;
            }

            .region-label {
                text-align: left;
                margin-top: 20px;
            }
        }
      `}</style>

      <section className="aurelian-portal-contact">
        {/* HEADER MOVED TO GLOBAL APP.JSX */}

        {/* CONTACT SECTION */}
        <section className="portal-contact-section">
          <div className="container-fluid px-5">
            
            {/* HERO */}
            <div className="row align-items-start gy-4">
              <div className="col-lg-6">
                <div className="section-label">Concierge Services</div>
                <h1 className="portal-title">The Onyx<br />Connection.</h1>
              </div>
              <div className="col-lg-6">
                <p className="portal-description mt-lg-5 pt-lg-4">
                  Inquiry into excellence requires a personal touch. Our
                  global team of curators and master craftsmen are available
                  for private consultations.
                </p>
              </div>
            </div>

            <div className="portal-divider"></div>

            {/* FORM + CONTACT */}
            <div className="row g-4">
              {/* LEFT FORM */}
              <div className="col-lg-7">
                <div className="inquiry-card">
                  <h3>Submit an Inquiry</h3>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label-luxury">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-luxury">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label-luxury">Subject of Interest</label>
                      <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option>Bespoke Trophies</option>
                        <option>Corporate Awards</option>
                        <option>Private Consultation</option>
                        <option>Global Partnerships</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label-luxury">Message</label>
                      <textarea
                        className="form-control"
                        placeholder="Describe your vision..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-gold">
                      Send Inquiry
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT CONTACT INFO */}
              <div className="col-lg-5">
                <div className="info-card">
                  <h3>Headquarters</h3>

                  <div className="contact-item">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                      <h6>Mayfair Studio</h6>
                      <p>
                        42 Berkeley Square, London<br />
                        W1J 5AW, United Kingdom
                      </p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <i className="fa-solid fa-phone"></i>
                    <div>
                      <h6>Private Line</h6>
                      <p>+44 (0) 20 7946 0123</p>
                    </div>
                  </div>

                  <div className="contact-item mb-0">
                    <i className="fa-regular fa-envelope"></i>
                    <div>
                      <h6>Direct Email</h6>
                      <p>prestige@aurelian-onyx.com</p>
                    </div>
                  </div>
                </div>

                <div className="map-card">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                    alt="Map"
                  />
                  <div className="map-status">
                    <span className="dot"></span>
                    Live Studio Status: Open
                  </div>
                </div>
              </div>
            </div>

            {/* GLOBAL ATELIERS */}
            <div className="global-ateliers">
              <div className="d-flex justify-content-between align-items-end flex-wrap mb-4">
                <h2>Global Ateliers</h2>
                <div className="region-label font-weight-bold">Select Your Region</div>
              </div>

              <div className="atelier-row">
                <div className="row gy-4">
                  <div className="col-md-4">
                    <div className="atelier-title">Geneva, Switzerland</div>
                    <div className="atelier-address">Rue du Rhône 12, 1204</div>
                  </div>
                  <div className="col-md-4">
                    <div className="atelier-title">New York, USA</div>
                    <div className="atelier-address">730 Fifth Avenue, NY 10019</div>
                  </div>
                  <div className="col-md-4">
                    <div className="atelier-title">Tokyo, Japan</div>
                    <div className="atelier-address">5-1-1 Ginza, Chuo City</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER MOVED TO GLOBAL APP.JSX */}
      </section>
    </>
  );
};

export default ContactUs;
