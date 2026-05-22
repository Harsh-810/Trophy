import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const PasswordRecovery = () => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [retrievedUser, setRetrievedUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: '0px', y: '0px' });

  // Atmospheric mouse tracking for micro-interaction glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setGlowPos({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setRetrievedUser(null);
    
    if (!email) {
      setErrorMsg('Please enter your registry email.');
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      if (res.ok) {
        const users = await res.json();
        if (users && users.length > 0) {
          setRetrievedUser(users[0]);
        } else {
          setErrorMsg('The specified registry key was not found in the Aurelian records.');
        }
      } else {
        setErrorMsg('Curation server connection issue. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the curation database.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <style>{`
        .recovery-page {
            background-color: #0B0B0B;
            color: #e5e2e1;
            font-family: 'Manrope', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            width: 100%;
        }

        .recovery-page a {
            text-decoration: none;
        }

        .golden-thread {
            background: linear-gradient(to bottom, transparent, #D4AF37, transparent);
            width: 1px;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            opacity: 0.3;
        }

        .bg-onyx-gradient {
            background: radial-gradient(circle at center, #1a1a1a 0%, #0b0b0b 100%);
        }

        .recovery-wrapper {
            min-height: 100vh;
            display: flex;
        }

        .hero-section {
            width: 50%;
            position: relative;
            background: #0e0e0e;
            display: flex;
            align-items: center;
            justify-content: center;
            border-r: 1px solid rgba(255,255,255,0.05);
            padding: 64px;
        }

        .hero-image-overlay {
            position: absolute;
            inset: 0;
            opacity: 0.4;
        }

        .hero-image-overlay img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-text-box {
            position: relative;
            z-index: 10;
            max-width: 480px;
            text-align: left;
        }

        .hero-kicker-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
        }

        .kicker-line {
            height: 48px;
            width: 1px;
            background: #f2ca50;
        }

        .kicker-text {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #f2ca50;
        }

        .hero-main-title {
            font-family: 'Playfair Display', serif;
            font-size: 64px;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 16px;
            color: #e5e2e1;
        }

        .hero-main-title .italic-gold {
            color: #f2ca50;
            font-style: italic;
        }

        .form-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 64px;
            position: relative;
        }

        .brand-mobile {
            display: none;
        }

        .form-card {
            width: 100%;
            max-width: 440px;
            text-align: left;
        }

        .form-header-title {
            font-family: 'Playfair Display', serif;
            font-size: 40px;
            font-weight: 600;
            color: #f2ca50;
            margin-bottom: 8px;
        }

        .form-header-subtitle {
            font-size: 16px;
            color: rgba(229, 226, 225, 0.7);
            margin-bottom: 40px;
        }

        .label-custom {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(229, 226, 225, 0.7);
            margin-bottom: 8px;
            display: block;
            transition: color 0.3s ease;
        }

        .input-group:focus-within .label-custom {
            color: #f2ca50;
        }

        .input-underline {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding: 16px 0;
            color: #fff;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .input-underline:focus {
            border-color: #f2ca50;
        }

        .input-underline::placeholder {
            color: rgba(255,255,255,0.25);
        }

        .btn-gold-recovery {
            width: 100%;
            background: #f2ca50;
            color: #241a00;
            padding: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-gold-recovery:hover {
            background: #ffe088;
        }

        .btn-outline-vault {
            display: block;
            width: 100%;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.15);
            color: #e5e2e1;
            padding: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 16px;
            transition: all 0.3s ease;
        }

        .btn-outline-vault:hover {
            border-color: #f2ca50;
            color: #f2ca50;
        }

        .footer-line-recovery {
            margin-top: 60px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            font-size: 12px;
            color: rgba(229, 226, 225, 0.5);
        }

        .footer-links-recovery a {
            color: rgba(229, 226, 225, 0.7);
            margin-left: 16px;
        }

        .footer-links-recovery a:hover {
            color: #f2ca50;
        }

        .cursor-glow {
            pointer-events: none;
            position: fixed;
            inset: 0;
            z-index: 0;
            opacity: 0.3;
            background: radial-gradient(600px circle at var(--x) var(--y), rgba(212, 175, 55, 0.05), transparent 40%);
        }

        @media (max-width: 991px) {
            .hero-section {
                padding: 40px;
            }

            .hero-main-title {
                font-size: 48px;
            }

            .form-section {
                padding: 40px;
            }
        }

        @media (max-width: 767px) {
            .hero-section {
                display: none;
            }

            .brand-mobile {
                display: block;
                position: absolute;
                top: 48px;
                left: 24px;
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                font-weight: 700;
                color: #f2ca50;
            }

            .form-section {
                padding: 100px 24px 40px;
            }

            .form-header-title {
                font-size: 32px;
            }
        }
      `}</style>

      <div className="recovery-page">
        <main className="recovery-wrapper">
          
          {/* LEFT SIDE */}
          <section className="hero-section">
            <div className="hero-image-overlay">
              <img
                alt="The Onyx Aesthetic"
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            
            <div className="hero-text-box">
              <div className="hero-kicker-row">
                <div className="kicker-line"></div>
                <span className="kicker-text">The Onyx Edition</span>
              </div>
              <h1 className="hero-main-title">
                Silence is <span className="italic-gold">Absolute.</span>
              </h1>
            </div>

            <div className="golden-thread"></div>
          </section>

          {/* RIGHT SIDE */}
          <section className="form-section bg-onyx-gradient">
            <div className="brand-mobile">Aurelian</div>

            <div className="form-card">
              {retrievedUser ? (
                <div className="vault-key-card p-4" style={{ background: 'rgba(20,20,22,0.95)', border: '1px solid #d4af37', padding: '40px', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                  <div className="text-center mb-4">
                    <i className="fa-solid fa-key mb-3" style={{ fontSize: '48px', color: '#f2ca50' }}></i>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#f2ca50', fontSize: '32px', marginBottom: '12px' }}>Access Restored</h3>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Welcome back, <strong>{retrievedUser.name}</strong>. Your curatorial registry access key is retrieved.</p>
                  </div>
                  
                  <div style={{ background: '#0b0b0c', border: '1px dashed rgba(212,175,55,0.4)', padding: '20px', borderRadius: '4px', fontSize: '24px', fontFamily: 'monospace', color: '#fff', letterSpacing: '2px', marginBottom: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                    {retrievedUser.password}
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(retrievedUser.password);
                        triggerNotification("Registry access key copied to clipboard!", 'success', 'Key Copied');
                      }} 
                      className="btn-gold-recovery mb-3"
                    >
                      Copy Access Key
                    </button>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="btn-outline-vault"
                      style={{ marginTop: '0px' }}
                    >
                      Proceed to Login
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="form-header-title">Recover Access</h2>
                    <p className="form-header-subtitle">
                      Enter your registry email to retrieve your curatorial access key.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="alert alert-danger mb-4 p-3" style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.2)', color: '#ea868f', fontSize: '14px' }}>
                      <i className="fa-solid fa-circle-exclamation me-2"></i> {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="input-group mb-5">
                      <label className="label-custom" htmlFor="email">Registry Email</label>
                      <input
                        id="email"
                        type="email"
                        className="input-underline"
                        placeholder="name@aurelian.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="btn-gold-recovery" disabled={isSearching}>
                        {isSearching ? 'Querying Registry...' : 'Request Access Key'}
                      </button>

                      <Link to="/login" className="btn-outline-vault">
                        Return to Vault
                      </Link>
                    </div>
                  </form>
                </>
              )}

              <div className="footer-line-recovery">
                <p>© 2026 Aurelian Trophies.</p>
                <div className="footer-links-recovery">
                  <Link to="/about">Security</Link>
                  <Link to="/about">Terms</Link>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ATMOSPHERIC CURSOR GLOW */}
        <div
          className="cursor-glow"
          style={{
            '--x': glowPos.x,
            '--y': glowPos.y
          }}
        ></div>
      </div>
    </>
  );
};

export default PasswordRecovery;
