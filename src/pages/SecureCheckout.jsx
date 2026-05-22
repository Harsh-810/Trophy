import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const SecureCheckout = ({ cart = [], onPlaceOrder, currentUser }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItems = cart || [];

  // Checkout values passed from ShoppingBag, or fallback to current calculations
  const statePrices = location.state || {};
  const subtotal = statePrices.subtotal || cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = statePrices.discount ? subtotal * statePrices.discount : 0;
  const shippingEstimate = statePrices.shippingEstimate !== undefined ? statePrices.shippingEstimate : (cartItems.length > 0 ? 45 : 0);
  const tax = statePrices.tax || ((subtotal - discountAmount) * 0.08);
  const total = statePrices.total || (subtotal - discountAmount + shippingEstimate + tax);

  // Form Fields
  const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(currentUser?.name?.split(' ')[1] || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Payment QR Fields
  const [transactionRef, setTransactionRef] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleVerifyUTR = (e) => {
    e.preventDefault();
    if (!transactionRef || transactionRef.trim().length < 6) {
      triggerNotification('Please enter a valid 12-digit transaction ID or reference number.', 'error', 'Validation Warning');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      triggerNotification('Transaction ID verified successfully! Proceeding with curation dispatch registration.', 'success', 'Verification Success');
    }, 1500);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!isVerified) {
      triggerNotification('Please scan the Curation QR Code and verify your Transaction Reference ID first.', 'error', 'Payment Required');
      return;
    }

    const orderData = {
      orderId: `ONYX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      address: `${address}, ${city}, ${postalCode}`,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        scale: item.scaleSelection || '12" Standard',
        engraving: item.engraving || 'None'
      })),
      subtotal,
      discount: discountAmount,
      shipping: shippingEstimate,
      tax,
      total,
      status: 'Pending Approval',
      paymentMethod: `QR Code Scan (Ref: ${transactionRef.trim().toUpperCase()})`
    };

    onPlaceOrder(orderData);
    triggerNotification('Victory Confirmed! Your luxury curation order has been submitted. Curation stage updated to Pending Approval.', 'success', 'Order Submitted');
    navigate('/profile');
  };

  return (
    <>
      <style>{`
        .checkout-page {
            background:
                radial-gradient(circle at top center, rgba(216,184,75,.06), transparent 30%),
                #050505;
            min-height: 100vh;
            color: #f4f1ea;
            font-family: 'Inter', sans-serif;
            text-align: left;
        }

        .checkout-header {
            border-bottom: 1px solid rgba(255,255,255,.08);
            padding: 20px 0;
            background: #080808;
        }

        .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 48px;
            font-weight: 700;
            color: #d7b547;
            text-decoration: none;
            line-height: 1;
        }

        .secure-checkout {
            color: rgba(255,255,255,.70);
            font-size: 13px;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .secure-checkout i {
            color: #d7b547;
        }

        .step-nav {
            display: flex;
            gap: 18px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 40px;
        }

        .step-nav span {
            color: rgba(255,255,255,.45);
        }

        .step-nav .active {
            color: #d7b547;
            font-weight: 600;
            border-bottom: 2px solid #d7b547;
            padding-bottom: 4px;
        }

        .page-title,
        .section-title,
        .summary-title {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
        }

        .page-title {
            font-size: 64px;
            margin-bottom: 40px;
            color: #fff;
        }

        .section-title {
            font-size: 42px;
            margin: 50px 0 20px;
            color: rgba(255,255,255,.90);
        }

        .summary-title {
            font-size: 34px;
            margin-bottom: 30px;
            color: #fff;
        }

        .form-label-luxury {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #bdbdbd;
            margin-bottom: 10px;
            display: block;
            font-weight: 600;
        }

        .checkout-page .form-control {
            background: #111112;
            border: 1px solid rgba(212,175,55,0.15);
            color: #fff;
            border-radius: 4px;
            height: 54px;
            padding: 14px 16px;
            outline: none;
            width: 100%;
        }

        .checkout-page .form-control:focus {
            background: #111112;
            color: #fff;
            border-color: rgba(216,184,75,.45);
            box-shadow: none;
        }

        .checkout-page .form-control::placeholder {
            color: #555;
        }

        .qr-payment-box {
            background: linear-gradient(180deg, #101011 0%, #080809 100%);
            border: 1px solid rgba(212, 175, 55, 0.22);
            padding: 34px;
            border-radius: 8px;
            text-align: center;
        }

        .qr-holder {
            background: #111112;
            padding: 16px;
            display: inline-block;
            border-radius: 12px;
            border: 4px solid #d7b547;
            box-shadow: 0 10px 30px rgba(215, 181, 71, 0.2);
            margin-bottom: 24px;
        }

        .qr-holder img {
            width: 200px;
            height: 200px;
            display: block;
        }

        .qr-instruction {
            font-size: 14px;
            line-height: 1.8;
            color: rgba(255,255,255,0.85);
            max-width: 460px;
            margin: 0 auto 28px;
        }

        .qr-instruction strong {
            color: #d7b547;
        }

        .btn-gold {
            background: linear-gradient(90deg,#d7b547,#f0cf57);
            border: none;
            color: #111;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 18px 40px;
            min-width: 280px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
        }

        .btn-gold:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(215, 181, 71, 0.35);
        }

        .btn-gold:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .order-summary {
            background: linear-gradient(180deg,#171717,#121212);
            border: 1px solid rgba(216,184,75,.18);
            padding: 35px;
            position: sticky;
            top: 40px;
            border-radius: 8px;
        }

        .summary-item {
            display: flex;
            gap: 15px;
            margin-bottom: 24px;
            align-items: center;
        }

        .summary-item img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 4px;
        }

        .product-name-checkout {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            margin-bottom: 2px;
            color: #fff;
            font-weight: 600;
        }

        .product-meta {
            font-size: 12px;
            color: rgba(255,255,255,.45);
        }

        .product-price-display {
            color: #d7b547;
            font-weight: 700;
            font-size: 18px;
            margin-top: 4px;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            color: rgba(255,255,255,.70);
            font-size: 14px;
        }

        .summary-total {
            border-top: 1px solid rgba(216,184,75,.18);
            margin-top: 20px;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .summary-total .label {
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: rgba(255,255,255,.70);
        }

        .summary-total .value {
            font-family: 'Cormorant Garamond', serif;
            color: #d7b547;
            font-size: 42px;
            font-weight: 700;
        }

        .security-note-box {
            margin-top: 20px;
            text-align: center;
            color: rgba(255,255,255,.45);
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .security-note-box i {
            color: #d7b547;
            margin-right: 8px;
        }

        .site-footer {
            margin-top: 100px;
            border-top: 1px solid rgba(255,255,255,.08);
            padding: 70px 0 30px;
            background: #080808;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 64px;
            font-weight: 700;
            color: #d7b547;
        }

        .footer-text {
            color: rgba(255,255,255,.70);
            line-height: 1.8;
            max-width: 320px;
        }

        .footer-links a {
            display: block;
            color: rgba(255,255,255,.70);
            text-decoration: none;
            margin-bottom: 12px;
        }

        .footer-phone {
            color: #d7b547;
            font-size: 30px;
            font-weight: 700;
            font-family: 'Cormorant Garamond', serif;
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,.04);
            margin-top: 50px;
            padding-top: 20px;
            color: rgba(255,255,255,.45);
            font-size: 14px;
        }

        @media(max-width:991px){
            .page-title {
                font-size: 48px;
            }

            .section-title {
                font-size: 34px;
            }

            .summary-total .value {
                font-size: 32px;
            }

            .btn-gold {
                width: 100%;
            }
        }
      `}</style>

      <div className="checkout-page">
        {/* HEADER */}
        <header className="checkout-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="brand">Aurelian</Link>
              <div className="secure-checkout">
                <i className="fa-solid fa-shield-halved"></i>
                Exclusive QR Checkout Only
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="py-5">
          <div className="container">
            <div className="row g-5">
              {/* LEFT COLUMN */}
              <div className="col-lg-8">
                <div className="step-nav">
                  <span className="active">1. Shipping</span>
                  <span className="active">2. UPI QR Code</span>
                  <span>3. Dispatched Review</span>
                </div>

                <h1 className="page-title">Concierge Shipping</h1>

                {/* Main Submit Form */}
                <form onSubmit={handleSubmitOrder}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label-luxury">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-luxury">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label-luxury">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label-luxury">Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-luxury">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-luxury">Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <h2 className="section-title">Scan QR Code to Pay</h2>

                  {/* QR PAYMENT CONTAINER */}
                  <div className="qr-payment-box">
                    <div className="qr-holder">
                      {/* Generates a gorgeous, crisp QR Code representing payments inside a clean mock container */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=aurelianconcierge@upi%26pn=Aurelian%2520Trophies%26am=${total}%26cu=INR`}
                        alt="Aurelian Curation QR Code"
                      />
                    </div>

                    <div className="qr-instruction">
                      Scan the **Aurelian Curation QR Code** above using any mobile banking or UPI payment app (Google Pay, PhonePe, Paytm, or BHIM) to settle your investment of <strong>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                    </div>

                    {/* UTR Verification Sub-form */}
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <label className="form-label-luxury mb-2 text-center w-100">Transaction ID / Reference Number (UTR)</label>
                        <div className="d-flex gap-2">
                          <input
                            type="text"
                            className="form-control text-center"
                            placeholder="e.g., 619283011234"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            disabled={isVerified}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-gold"
                            style={{ minWidth: '120px' }}
                            onClick={handleVerifyUTR}
                            disabled={isVerifying || isVerified || !transactionRef}
                          >
                            {isVerifying ? 'Verifying...' : isVerified ? 'Verified ✓' : 'Verify'}
                          </button>
                        </div>
                        {isVerified && (
                          <div className="text-success small mt-2 text-center font-weight-bold">
                            ✓ Transaction Reference officially logged in the Curatorial database!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button
                      type="submit"
                      className="btn btn-gold w-100"
                      style={{ fontSize: '15px', padding: '20px' }}
                      disabled={!isVerified}
                    >
                      Place Curation Order (₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-lg-4">
                <aside className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>

                  {cartItems.map((item, index) => (
                    <div className="summary-item" key={item.id + '-' + index}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <div className="product-name-checkout">{item.name}</div>
                        <div className="product-meta">Qty: {item.quantity} | Scale: {item.scaleSelection || '12" Standard'}</div>
                        <div className="product-price-display">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  ))}

                  <hr className="border-secondary opacity-25 my-4" />

                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="summary-line text-success">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="summary-line">
                    <span>Insured Shipping</span>
                    <span>₹{shippingEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="summary-line">
                    <span>Tax (Estimated)</span>
                    <span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="summary-total">
                    <span className="label">Total Settle</span>
                    <span className="value">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <p className="summary-note">
                    By completing this purchase, you agree to the
                    Aurelian Trophies Bespoke Terms of Service.
                    Payments are handled exclusively via secure geologic curation QR scan.
                  </p>
                </aside>

                <div className="security-note-box">
                  <i className="fa-solid fa-lock text-warning"></i>
                  Exclusive Curation Settle Vault Active
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-6">
                <div className="footer-brand">Aurelian</div>
                <p className="footer-text">
                  Defining excellence through artisanal craftsmanship and
                  uncompromising quality since 1924.
                </p>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Support</div>
                <div className="footer-links">
                  <Link to="/contact">Shipping & Returns</Link>
                  <Link to="/contact">Contact Us</Link>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="footer-title">Concierge</div>
                <p className="footer-text mb-2">
                  Monday – Friday<br />
                  9:00 AM – 6:00 PM EST
                </p>
                <div className="footer-phone">1-800-AURELIAN</div>
              </div>
            </div>

            <div className="footer-bottom d-flex justify-content-between align-items-center">
              <div>© 2026 Aurelian Trophies. Crafted for Excellence.</div>
              <div className="footer-icons">
                <i className="fa-solid fa-globe"></i>
                <i className="fa-solid fa-qrcode"></i>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SecureCheckout;
