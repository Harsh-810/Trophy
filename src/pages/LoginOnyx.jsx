import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginOnyx = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email.toLowerCase().trim()}`);
      if (res.ok) {
        const users = await res.json();
        if (users && users.length > 0) {
          const user = users[0];
          if (user.blocked) {
            setErrorMsg('Your account has been suspended by the curator.');
            setIsLoading(false);
            return;
          }
          if (user.password === password) {
            // Success!
            onLogin(user);
            if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/profile');
            }
          } else {
            setErrorMsg('Invalid password.');
          }
        } else {
          setErrorMsg('Email not found.');
        }
      } else {
        setErrorMsg('Authentication server error.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the authentication database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .onyx-login-page {
            font-family: 'Inter', sans-serif;
            background: #000;
            color: #f5f3ef;
            min-height: 100vh;
            overflow: hidden;
            width: 100%;
        }

        .onyx-login-page a {
            text-decoration: none;
        }

        .onyx-login-page input:focus {
            outline: none;
            box-shadow: none;
        }

        .onyx-login-wrapper {
            min-height: 100vh;
        }

        .left-panel {
            position: relative;
            min-height: 100vh;
            padding: 90px 90px;
            display: flex;
            align-items: center;
            background:
                linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.75)),
                url('https://imgs.search.brave.com/Jawqdsyx7FssDR-C_nAQk2qU6Kw5JK6j7Vrnjw_U-HU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzIwLzIwLzM5LzI4/LzM2MF9GXzIwMjAz/OTI4MDRfS2taZHg2/M2taS1daY2J5R2Rk/VTFNV3A1dFl5a1hO/N0UuanBn');
            background-size: cover;
            background-position: center;
        }

        .left-panel::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 30% 20%, rgba(229,195,77,0.08), transparent 35%),
                radial-gradient(circle at 80% 80%, rgba(229,195,77,0.06), transparent 30%);
        }

        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 460px;
            text-align: left;
        }

        .hero-kicker {
            display: flex;
            align-items: center;
            gap: 14px;
            color: #e5c34d;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 30px;
        }

        .hero-kicker::before {
            content: "";
            width: 2px;
            height: 40px;
            background: #e5c34d;
        }

        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 6.6rem;
            line-height: 0.95;
            font-weight: 700;
            margin-bottom: 28px;
            color: #fff;
        }

        .hero-title .gold {
            color: #e5c34d;
            font-style: italic;
        }

        .hero-description {
            color: rgba(255,255,255,0.72);
            font-size: 1.9rem;
            line-height: 1.8;
            max-width: 430px;
        }

        .right-panel {
            background:
                radial-gradient(circle at top right, rgba(229,195,77,0.05), transparent 30%),
                #050505;
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 70px 80px;
            text-align: left;
        }

        .login-box {
            width: 100%;
            max-width: 470px;
            margin: 0 auto;
        }

        .login-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 5rem;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 14px;
            color: #fff;
        }

        .login-subtitle {
            color: rgba(255,255,255,0.72);
            font-size: 1.55rem;
            margin-bottom: 65px;
        }

        .form-group {
            margin-bottom: 26px;
        }

        .form-label {
            color: rgba(255,255,255,0.88);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
            display: block;
        }

        .form-control-luxury {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(229, 195, 77, 0.22);
            border-radius: 0;
            padding: 12px 0 14px;
            color: #fff;
            font-size: 1.7rem;
            outline: none;
        }

        .form-control-luxury::placeholder {
            color: rgba(255,255,255,0.35);
        }

        .password-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .recover-link {
            color: #e5c34d;
            font-size: 12px;
            font-weight: 600;
        }

        .password-wrapper {
            position: relative;
        }

        .password-toggle {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.55);
            font-size: 16px;
            cursor: pointer;
        }

        .form-check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 26px 0 36px;
        }

        .form-check input {
            width: 16px;
            height: 16px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.3);
            cursor: pointer;
        }

        .form-check label {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
            cursor: pointer;
        }

        .btn-portal {
            width: 100%;
            border: none;
            border-radius: 0;
            padding: 18px 24px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            transition: all .3s ease;
            cursor: pointer;
        }

        .btn-enter {
            background: linear-gradient(90deg, #e5c34d, #f4d96b);
            color: #111;
            box-shadow: 0 12px 35px rgba(229,195,77,0.15);
        }

        .btn-request {
            background: transparent;
            color: #fff;
            border: 1px solid rgba(229,195,77,0.25);
            margin-top: 14px;
        }

        .btn-request:hover {
            background: rgba(229,195,77,0.06);
            color: #fff;
        }

        .login-footer {
            margin-top: 70px;
            padding-top: 18px;
            border-top: 1px solid rgba(229,195,77,0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }

        .footer-left {
            color: rgba(255,255,255,0.35);
            font-size: 13px;
        }

        .footer-links a {
            color: rgba(255,255,255,0.6);
            font-size: 13px;
            margin-left: 20px;
        }

        @media (max-width: 991px) {
            .left-panel {
                min-height: 420px;
                padding: 70px 40px;
            }

            .hero-title {
                font-size: 4.8rem;
            }

            .right-panel {
                padding: 60px 30px;
            }

            .login-title {
                font-size: 4rem;
            }
        }

        @media (max-width: 767px) {
            .left-panel {
                display: none;
            }

            .right-panel {
                padding: 50px 24px;
            }

            .login-title {
                font-size: 3.4rem;
            }

            .login-subtitle {
                margin-bottom: 45px;
            }
        }
      `}</style>

      <section className="onyx-login-page">
        <div className="container-fluid p-0">
          <div className="row g-0 onyx-login-wrapper">

            {/* LEFT PANEL */}
            <div className="col-lg-6 left-panel">
              <div className="hero-content">
                <div className="hero-kicker">Trophy Collection</div>

                <h1 className="hero-title">
                  Welcome<br />
                  <span className="gold">Back.</span>
                </h1>

                <p className="hero-description">
                  Log in to access your account and explore our exclusive collection of trophies and heritage pieces.
                </p>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-lg-6 right-panel">
              <div className="login-box">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">
                  Please log in to your account.
                </p>

                {errorMsg && (
                  <div className="alert alert-danger mb-4 p-3" style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.2)', color: '#ea868f', fontSize: '14px' }}>
                    <i className="fa-solid fa-circle-exclamation me-2"></i> {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control-luxury"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <div className="password-row">
                      <label className="form-label mb-0">Password</label>
                      <Link to="/recovery" className="recover-link">
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control-luxury"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <div className="form-check">
                    <input type="checkbox" id="remember" defaultChecked />
                    <label htmlFor="remember">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Buttons */}
                  <button type="submit" className="btn btn-portal btn-enter" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Log In'}
                  </button>

                  <Link to="/register">
                    <button type="button" className="btn btn-portal btn-request">
                      Register
                    </button>
                  </Link>
                </form>

                {/* Footer */}
                <div className="login-footer">
                  <div className="footer-left">
                    © 2026 Aurelian Trophies.
                  </div>

                  <div className="footer-links">
                    <Link to="/about">Security</Link>
                    <Link to="/about">Terms</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default LoginOnyx;
