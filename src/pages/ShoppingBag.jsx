import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const ShoppingBag = ({ cartItems, coupons = [], onUpdateQuantity, onRemoveFromCart, cartCount }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [shippingEstimate, setShippingEstimate] = useState(45);
  const [postalCode, setPostalCode] = useState('');

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shippingEstimate + tax;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    
    if (code === '') {
      setPromoError('Please enter a coupon code.');
      return;
    }

    const matchedCoupon = coupons.find(c => c.code.toUpperCase() === code);

    if (matchedCoupon) {
      setDiscount(matchedCoupon.discount / 100);
      setPromoSuccess(`Coupon applied: ${matchedCoupon.discount}% Off!`);
      setIsCouponApplied(true);
    } else {
      setPromoError('Invalid coupon code. Please try a valid one.');
      setDiscount(0);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setDiscount(0);
    setPromoSuccess('');
    setPromoError('');
    setIsCouponApplied(false);
  };

  const handleCalculateShipping = () => {
    if (postalCode.trim().length > 3) {
      // Simulate different shipping based on postal code
      const sum = postalCode.split('').reduce((acc, char) => acc + (isNaN(char) ? 0 : Number(char)), 0);
      const est = sum % 2 === 0 ? 30 : 60;
      setShippingEstimate(est);
      triggerNotification(`Shipping estimate recalculated for your region: ₹${est}.00`, 'success', 'Shipping Calculated');
    } else {
      triggerNotification('Please enter a valid postal code.', 'error', 'Invalid Postal Code');
    }
  };

  return (
    <>
      <style>{`
        .cart-page {
            background:
                radial-gradient(circle at top center, rgba(215,181,71,.05), transparent 35%),
                #060606;
            min-height: 100vh;
            color: #f4f1ea;
            font-family: 'Inter', sans-serif;
        }

        .site-header {
            border-bottom: 1px solid rgba(255,255,255,.07);
            background: #080808;
        }

        .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 46px;
            font-weight: 700;
            color: #d7b547;
            text-decoration: none;
        }

        .cart-page .nav-link {
            color: #d5d5d5 !important;
            font-size: 15px;
            font-weight: 500;
            margin: 0 12px;
        }

        .cart-page .nav-link:hover {
            color: #d7b547 !important;
        }

        .header-icons a {
            color: #d7b547;
            margin-left: 22px;
            font-size: 20px;
        }

        .breadcrumb-custom {
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: rgba(255,255,255,.45);
            margin-bottom: 30px;
        }

        .breadcrumb-custom span {
            color: #d7b547;
            font-weight: 600;
        }

        .page-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 92px;
            font-weight: 700;
            margin-bottom: 50px;
            color: #fff;
        }

        .cart-item {
            display: grid;
            grid-template-columns: 160px 1fr 40px 160px;
            gap: 30px;
            align-items: start;
            padding: 0 0 42px;
            border-bottom: 1px solid rgba(255,255,255,.05);
            margin-bottom: 42px;
        }

        .cart-item img {
            width: 160px;
            height: 160px;
            object-fit: cover;
            display: block;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-title-cart {
            font-family: 'Cormorant Garamond', serif;
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #fff;
        }

        .product-subtitle {
            color: rgba(255,255,255,.72);
            font-size: 18px;
            margin-bottom: 42px;
        }

        .qty-box {
            display: inline-flex;
            align-items: center;
            border: 1px solid rgba(255,255,255,.08);
            background: #111;
        }

        .qty-box button {
            width: 42px;
            height: 42px;
            border: none;
            background: transparent;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
        }

        .qty-box span {
            width: 44px;
            text-align: center;
            font-weight: 600;
        }

        .remove-btn {
            color: #cfcfcf;
            font-size: 28px;
            text-decoration: none;
            display: inline-block;
            margin-top: 8px;
            border: none;
            background: transparent;
            cursor: pointer;
        }

        .remove-btn:hover {
            color: #ff5f5f;
        }

        .price-display {
            font-family: 'Cormorant Garamond', serif;
            color: #d7b547;
            font-size: 52px;
            font-weight: 700;
            align-self: end;
            text-align: right;
        }

        .shipping-box {
            background: linear-gradient(180deg,#151515,#111);
            border: 1px solid rgba(255,255,255,.07);
            padding: 35px;
            margin-top: 18px;
        }

        .box-label {
            color: #d7b547;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 26px;
        }

        .shipping-box .form-control {
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255,255,255,.08);
            border-radius: 0;
            color: #fff;
            height: 54px;
            padding-left: 0;
            outline: none;
        }

        .shipping-box .form-control::placeholder {
            color: #7a7a7a;
        }

        .btn-outline-gold {
            border: 1px solid #d7b547;
            color: #d7b547;
            background: transparent;
            padding: 14px 28px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-outline-gold:hover {
            background: #d7b547;
            color: #111;
        }

        .summary-card {
            background: linear-gradient(180deg,#1b1b1c,#161617);
            border: 1px solid rgba(255,255,255,.06);
            border-radius: 18px;
            padding: 40px;
            position: sticky;
            top: 30px;
            box-shadow: 0 20px 50px rgba(0,0,0,.4);
        }

        .summary-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 56px;
            font-weight: 700;
            margin-bottom: 34px;
            color: #fff;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 22px;
            color: rgba(255,255,255,.72);
            font-size: 16px;
        }

        .summary-line strong {
            color: #fff;
        }

        .promo-label {
            color: #b9b9b9;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 35px 0 12px;
        }

        .promo-box {
            display: flex;
            border-bottom: 1px solid rgba(255,255,255,.08);
            padding-bottom: 8px;
        }

        .promo-box input {
            flex: 1;
            background: transparent;
            border: none;
            color: #fff;
            outline: none;
        }

        .promo-box input::placeholder {
            color: #777;
        }

        .promo-box button {
            background: none;
            border: none;
            color: #d7b547;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            cursor: pointer;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin: 34px 0 28px;
        }

        .total-row .label {
            font-family: 'Cormorant Garamond', serif;
            font-size: 42px;
            font-weight: 700;
        }

        .total-row .amount {
            font-family: 'Cormorant Garamond', serif;
            font-size: 68px;
            font-weight: 700;
            color: #d7b547;
            line-height: 1;
        }

        .btn-gold {
            width: 100%;
            background: linear-gradient(90deg,#d7b547,#f2cf56);
            border: none;
            color: #111;
            padding: 18px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            border-radius: 4px;
            cursor: pointer;
            transition: opacity 0.3s ease;
        }

        .btn-gold:hover {
            opacity: 0.95;
        }

        .security-note {
            text-align: center;
            margin-top: 18px;
            color: rgba(255,255,255,.45);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .security-note i {
            color: #d7b547;
            margin-right: 6px;
        }

        .return-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 55px;
            color: #ddd;
            text-decoration: none;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: color 0.3s ease;
        }

        .return-link:hover {
            color: #d7b547;
        }

        .site-footer {
            margin-top: 100px;
            padding: 90px 0 30px;
            border-top: 1px solid rgba(255,255,255,.05);
            background: #050505;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 78px;
            font-weight: 700;
            color: #d7b547;
            margin-bottom: 18px;
        }

        .footer-text {
            color: rgba(255,255,255,.72);
            line-height: 1.8;
            max-width: 340px;
        }

        .footer-title {
            color: #d7b547;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .footer-links a {
            display: block;
            color: rgba(255,255,255,.72);
            text-decoration: none;
            margin-bottom: 14px;
        }

        .footer-links a:hover {
            color: #d7b547;
        }

        .footer-social a {
            color: #ddd;
            font-size: 20px;
            margin-right: 18px;
        }

        .footer-bottom {
            margin-top: 60px;
            padding-top: 25px;
            border-top: 1px solid rgba(255,255,255,.04);
            color: rgba(255,255,255,.40);
            font-size: 13px;
        }

        .footer-bottom .est {
            color: rgba(255,255,255,.35);
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        @media (max-width: 991px) {
            .page-title {
                font-size: 58px;
            }

            .cart-item {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .price-display {
                text-align: left;
                font-size: 42px;
            }

            .product-title-cart {
                font-size: 38px;
            }

            .summary-card {
                margin-top: 40px;
                position: static;
            }

            .footer-brand {
                font-size: 56px;
            }
        }
      `}</style>

      <div className="cart-page">
        {/* HEADER */}
        <header className="site-header py-3">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="brand">Aurelian</Link>

              <nav className="d-none d-lg-flex align-items-center">
                <Link className="nav-link" to="/catalog">Catalog</Link>
                <Link className="nav-link" to="/custom-order">Client Submission</Link>
                <Link className="nav-link" to="/about">About Heritage</Link>
                <Link className="nav-link" to="/profile">My Profile</Link>
              </nav>

              <div className="header-icons">
                <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i><span className="ms-1 small">({cartCount})</span></Link>
                <Link to="/profile"><i className="fa-regular fa-circle-user"></i></Link>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN SECTION */}
        <section className="py-5">
          <div className="container">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-bag-shopping mb-4" style={{ fontSize: '72px', color: '#d7b547' }}></i>
                <h1 className="page-title mb-3" style={{ fontSize: '56px' }}>Your Bag is Empty</h1>
                <p className="text-muted mb-5 fs-5">You haven't added any luxury masterpieces to your bag yet.</p>
                <Link to="/catalog" className="btn btn-gold px-5 d-inline-block w-auto">
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="row g-5">
                {/* LEFT SIDE */}
                <div className="col-lg-8">
                  <div className="breadcrumb-custom">
                    Home / <span>Shopping Cart</span>
                  </div>

                  <h1 className="page-title">Your Collection</h1>

                  {/* CART ITEMS */}
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.uniqueKey || item.id}>
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h2 className="product-title-cart">{item.name}</h2>
                        <p className="product-subtitle text-muted-50 mb-3" style={{ fontSize: '14px' }}>
                          Scale: {item.selectedScale || '10" Standard'} | Engraving: "{item.engravingText || 'None'}"
                        </p>

                        <div className="qty-box">
                          <button onClick={() => onUpdateQuantity(item.id, item.scaleSelection, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.scaleSelection, 1)}>+</button>
                        </div>
                      </div>

                      <button className="remove-btn" onClick={() => {
                        onRemoveFromCart(item.id, item.scaleSelection);
                        triggerNotification(`"${item.name}" removed from curation bag.`, 'info', 'Item Removed');
                      }}>
                        &times;
                      </button>

                      <div className="price-display">
                        ₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}

                  {/* SHIPPING BOX */}
                  <div className="shipping-box">
                    <div className="box-label">Shipping Destination</div>
                    <div className="row g-4 align-items-end">
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Postal Code / Region (e.g. 90210)"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-5">
                        <button className="btn-outline-gold" onClick={handleCalculateShipping}>
                          Calculate Estimate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RETURN LINK */}
                  <Link to="/catalog" className="return-link">
                    <i className="fa-solid fa-arrow-left"></i>
                    Return to Catalog
                  </Link>
                </div>

                {/* RIGHT SIDE (SUMMARY) */}
                <div className="col-lg-4">
                  <div className="summary-card">
                    <h3 className="summary-title">Order Summary</h3>

                    <div className="summary-line">
                      <span>Subtotal</span>
                      <strong>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>

                    {discount > 0 && (
                      <div className="summary-line text-success">
                        <span>Discount ({discount * 100}%)</span>
                        <strong>-₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                    )}

                    <div className="summary-line">
                      <span>Shipping</span>
                      <strong>₹{shippingEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>

                    <div className="summary-line">
                      <span>Estimated Tax (8%)</span>
                      <strong>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>

                    <div className="promo-label">Coupon Code</div>
                    <div className="promo-box">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={isCouponApplied}
                      />
                      {isCouponApplied ? (
                        <button onClick={handleRemovePromo} className="text-danger">Remove</button>
                      ) : (
                        <button onClick={handleApplyPromo}>Apply</button>
                      )}
                    </div>
                    {promoError && <div className="text-danger small mt-2">{promoError}</div>}
                    {promoSuccess && <div className="text-success small mt-2">{promoSuccess}</div>}

                    <div className="total-row">
                      <div className="label">Total</div>
                      <div className="amount">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    <button className="btn-gold" onClick={() => navigate('/checkout', { state: { subtotal, discount, shippingEstimate, tax, total } })}>
                      Proceed to Checkout
                    </button>

                    <div className="security-note">
                      <i className="fa-solid fa-lock"></i>
                      Secure • Fully Insured Shipping
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-4">
                <div className="footer-brand">Aurelian</div>
                <p className="footer-text">
                  Crafting symbols of excellence for the world's most
                  distinguished achievers since 1924.
                </p>
              </div>

              <div className="col-lg-2">
                <div className="footer-title">Legal</div>
                <div className="footer-links">
                  <Link to="/about">Privacy Policy</Link>
                  <Link to="/about">Terms of Service</Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Service</div>
                <div className="footer-links">
                  <Link to="/contact">Shipping &amp; Returns</Link>
                  <Link to="/contact">Contact Us</Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Connect</div>
                <div className="footer-social">
                  <a href="#g"><i className="fa-solid fa-globe"></i></a>
                  <a href="#v"><i className="fa-solid fa-volume-high"></i></a>
                  <a href="#e"><i className="fa-regular fa-envelope"></i></a>
                </div>
              </div>
            </div>

            <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
              <div>© 2026 Aurelian Trophies. Crafted for Excellence.</div>
              <div className="est">Est. 1924</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ShoppingBag;
