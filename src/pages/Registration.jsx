import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const Registration = ({ onLogin }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      triggerNotification('Please fill out all fields.', 'error', 'Validation Warning');
      return;
    }
    if (!agreeTerms) {
      triggerNotification('Please accept the Terms of Excellence.', 'error', 'Validation Warning');
      return;
    }

    try {
      // Prevent duplicate registry
      const checkRes = await fetch(`http://localhost:3001/users?email=${email.toLowerCase().trim()}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        triggerNotification('This email is already registered in the vault. Please proceed to login.', 'error', 'Duplicate Email');
        return;
      }

      // Format payload
      const newUser = {
        name: fullName,
        email: email.toLowerCase().trim(),
        password: password,
        role: 'client',
      };

      // Push to backend
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const createdUser = await res.json();
        // Auto-login securely formatted user
        onLogin(createdUser);
        triggerNotification(`Portal registration initiated successfully! Welcome, ${fullName}.`, 'success', 'Portal Registration');
        navigate('/profile');
      } else {
        triggerNotification('Database rejection: Failed to register user.', 'error', 'Registration Failed');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('Database connection error. Ensure the local server is running.', 'error', 'Database Connection Error');
    }
  };

  return (
    <>
      <style>{`
        .portal-register {
            background: #000;
            color: #f5f1e8;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }

        .portal-register a {
            text-decoration: none;
        }

        .portal-hero {
            min-height: 100vh;
        }

        .hero-left {
            position: relative;
            min-height: 100vh;
            background:
                linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.75)),
                url('https://imgs.search.brave.com/-rb_ZIRMlkkZyMQMW8L43SNkiUvquZenPDhwtUhhmG8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTkv/NjA1LzUwOS9zbWFs/bC9ibGFjay1nb2xk/ZW4tc2lkZS1zbGFu/dC1zcGVlZC1saW5l/cy1hd2FyZC1iYWNr/Z3JvdW5kLXRyb3Bo/eS1vbi1sdXh1cnkt/YmFja2dyb3VuZC1t/b2Rlcm4tc2hpbW1l/ci1hYnN0cmFjdC1k/ZXNpZ24tdGVtcGxh/dGUtbGVkLXZpc3Vh/bC1tb3Rpb24tZ3Jh/cGhpY3Mtd2VkZGlu/Zy1pbnZpdGF0aW9u/LXBvc3Rlci1jZXJ0/aWZpY2F0ZS1kZXNp/Z24tdmVjdG9yLmpw/Zw')
                center center/cover no-repeat;
            display: flex;
            align-items: flex-end;
            padding: 80px 60px;
        }

        .hero-left::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 25% 20%, rgba(216,184,75,.12), transparent 45%),
                linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.15));
        }

        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 560px;
            text-align: left;
        }

        .portal-hero .kicker {
            font-size: 14px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #d8b84b;
            font-weight: 600;
            margin-bottom: 18px;
        }

        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 88px;
            line-height: .9;
            font-weight: 700;
            color: #f4d46a;
            margin-bottom: 24px;
        }

        .hero-text {
            font-size: 30px;
            line-height: 1.3;
            color: #f2f2f2;
            max-width: 520px;
        }

        .hero-est {
            margin-top: 50px;
            display: flex;
            align-items: center;
            gap: 18px;
            color: rgba(255,255,255,.55);
            font-size: 12px;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .hero-est::before {
            content: "";
            width: 80px;
            height: 1px;
            background: rgba(216,184,75,.35);
        }

        .form-panel {
            min-height: 100vh;
            background:
                radial-gradient(circle at top right, rgba(216,184,75,.08), transparent 30%),
                #0a0a0c;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 70px 80px;
            position: relative;
            text-align: left;
        }

        .register-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 64px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .register-subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 18px;
            margin-bottom: 40px;
        }

        .form-label {
            color: #b9b9b9;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .portal-register .form-control {
            height: 58px;
            background: #f8f8f8;
            border: none;
            border-radius: 0;
            font-size: 15px;
            padding: 14px 18px;
            color: #111;
        }

        .portal-register .form-control::placeholder {
            color: #b6b6b6;
        }

        .input-group-text {
            background: #f8f8f8;
            border: none;
            border-radius: 0;
            color: #999;
            cursor: pointer;
        }

        .form-check {
            margin: 22px 0 30px;
        }

        .form-check-input {
            background: transparent;
            border: 1px solid rgba(255,255,255,.35);
            border-radius: 0;
        }

        .form-check-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            line-height: 1.6;
        }

        .form-check-label a {
            color: #d8b84b;
            text-decoration: none;
        }

        .btn-gold {
            width: 100%;
            border: none;
            background: linear-gradient(90deg, #d8b84b, #f1d35d);
            color: #111;
            height: 58px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 28px;
            cursor: pointer;
        }

        .divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 26px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 12px;
            text-transform: uppercase;
        }

        .divider::before,
        .divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,.08);
        }

        .social-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 42px;
        }

        .btn-social {
            border: 1px solid rgba(255,255,255,.15);
            background: transparent;
            color: #fff;
            height: 52px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-social:hover {
            background: rgba(255,255,255,0.05);
        }

        .btn-social i {
            margin-right: 10px;
        }

        .login-text {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 15px;
        }

        .login-text a {
            color: #d8b84b;
            font-weight: 600;
            text-decoration: none;
        }

        .side-label {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            writing-mode: vertical-rl;
            letter-spacing: 4px;
            font-size: 12px;
            color: rgba(216,184,75,.6);
            text-transform: uppercase;
        }

        .portal-footer {
            background: #050505;
            border-top: 1px solid rgba(255,255,255,.04);
            padding: 32px 0;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', serif;
            color: #d8b84b;
            font-size: 48px;
            font-weight: 700;
            text-align: left;
        }

        .footer-copy {
            color: rgba(255,255,255,.55);
            font-size: 14px;
            text-align: left;
        }

        .footer-links a {
            color: rgba(255,255,255,.70);
            text-decoration: none;
            margin: 0 14px;
            font-size: 14px;
        }

        @media (max-width: 991px) {
            .hero-left {
                min-height: 60vh;
                padding: 60px 30px;
            }

            .hero-title {
                font-size: 56px;
            }

            .hero-text {
                font-size: 22px;
            }

            .form-panel {
                padding: 50px 30px;
            }

            .register-title {
                font-size: 46px;
            }

            .social-buttons {
                grid-template-columns: 1fr;
            }

            .side-label {
                display: none;
            }
        }
      `}</style>

      <div className="portal-register">
        {/* HERO */}
        <section className="portal-hero">
          <div className="row g-0">
            {/* LEFT VISUAL */}
            <div className="col-lg-6 hero-left">
              <div className="hero-content">
                <div className="kicker">Onyx Edition</div>

                <h1 className="hero-title">
                  The Circle of<br />
                  Excellence.
                </h1>

                <p className="hero-text">
                  Join an elite community where craftsmanship meets legacy.
                  Your journey into the extraordinary begins here.
                </p>

                <div className="hero-est">Est. 1924</div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-6 form-panel">
              <div className="side-label">Aurelian Systems</div>

              <h2 className="register-title">Create Portal</h2>
              <p className="register-subtitle">
                Enter your credentials to secure your invitation.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Please Enter Your Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Please Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I accept the <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Excellence</Link> and acknowledge the privacy protocol.
                  </label>
                </div>

                <button type="submit" className="btn-gold">
                  Initiate Registration
                </button>

                <div className="divider">Or Authenticate With</div>

                <div className="social-buttons">
                  <button type="button" className="btn-social" onClick={() => {
                    setFullName('Elias Thorne');
                    setEmail('e.thorne@gmail.com');
                    setAgreeTerms(true);
                    triggerNotification('Simulated Google Authentication completed. Click "Initiate Registration" to finalize.', 'info', 'Google OAuth Simulated');
                  }}>
                    <i className="fab fa-google"></i> Google
                  </button>

                  <button type="button" className="btn-social" onClick={() => {
                    setFullName('Elias Thorne');
                    setEmail('e.thorne@facebook.com');
                    setAgreeTerms(true);
                    triggerNotification('Simulated Facebook Authentication completed. Click "Initiate Registration" to finalize.', 'info', 'Facebook OAuth Simulated');
                  }}>
                    <i className="fab fa-facebook-f"></i> Facebook
                  </button>
                </div>

                <div className="login-text">
                  Already part of the legacy? <Link to="/login">Portal Access</Link>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="portal-footer">
          <div className="container-fluid px-5">
            <div className="row align-items-center gy-3">
              <div className="col-lg-4">
                <div className="footer-brand">Aurelian.</div>
                <div className="footer-copy">
                  © 2026 Aurelian Trophies. Crafted for Excellence.
                </div>
              </div>

              <div className="col-lg-8 text-lg-end footer-links">
                <Link to="/about">Privacy Policy</Link>
                <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                <Link to="/contact">Shipping & Returns</Link>
                <Link to="/contact">Contact Us</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Registration;
