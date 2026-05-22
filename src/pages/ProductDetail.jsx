import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductDetail = ({ allProducts, onAddToCart, cartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Customization State
  const [selectedScale, setSelectedScale] = useState('10" Grand');
  const [engravingText, setEngravingText] = useState('');
  const [needsLogo, setNeedsLogo] = useState(false);
  const [needsEventTitle, setNeedsEventTitle] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  const customizeRef = useRef(null);
  
  const product = useMemo(() => {
    return allProducts.find(p => p.id == id) || allProducts[0];
  }, [allProducts, id]);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    return allProducts.filter(p => p.id !== product?.id).slice(0, 4);
  }, [allProducts, product]);

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedScale,
      engravingText: engravingText || 'None',
      needsLogo,
      needsEventTitle,
      uniqueKey: `${product.id}-${selectedScale}-${engravingText}-${needsLogo}`
    };
    onAddToCart(productWithOptions);
  };

  const scrollToCustomization = () => {
    if (customizeRef.current) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = customizeRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const originalPrice = product?.price ? Math.floor(product.price * 1.15) : 0; 
  
  if (!product) return <div className="text-center text-white py-5">Product not found</div>;

  return (
    <>
      <style>{`
        #modern-product-page {
            background: #070707;
            color: #f4f1eb;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            line-height: 1.6;
            min-height: 100vh;
            padding-top: 120px; /* Accounts for global fixed navbar */
        }

        #modern-product-page a {
            text-decoration: none;
        }



        /* --- BREADCRUMB --- */
        .lux-breadcrumb {
            padding: 24px 0;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
        }
        .lux-breadcrumb a { color: rgba(255, 255, 255, 0.5); }
        .lux-breadcrumb a:hover { color: #fff; }
        .lux-breadcrumb span.active { color: #e4c24b; font-weight: 500; }
        
        .product-main { padding: 0 0 60px; }

        /* --- GALLERY --- */
        .gallery-wrapper {
            background: #0e0f12;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 0;
            padding: 0;
        }
        .main-image-container {
            width: 100%;
            height: 580px;
            border-radius: 0;
            overflow: hidden;
            margin-bottom: 0;
            background: #0e0f12;
        }
        .main-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .thumb-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            margin-top: 18px;
            padding: 0;
        }
        .thumb-strip img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 0;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.05);
            opacity: 1;
            transition: 0.3s;
        }
        .thumb-strip img:hover { border-color: rgba(228,194,75,0.5); }
        .thumb-strip img.active {
            border-color: #e4c24b;
        }

        /* --- PRODUCT INFO --- */
        .product-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 42px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 5px;
            line-height: 1.2;
        }
        .product-tagline {
            color: #e4c24b;
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .reviews-summary {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
            font-size: 14px;
        }
        .stars { color: #f0a500; letter-spacing: 2px; }
        .review-text { color: #4da6ff; cursor: pointer; }
        .review-text:hover { text-decoration: underline; }

        .price-wrap {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            margin-bottom: 20px;
        }
        .current-price {
            font-size: 36px;
            font-weight: 700;
            color: #fff;
            line-height: 1;
        }
        .original-price {
            font-size: 16px;
            color: #888;
            text-decoration: line-through;
            margin-bottom: 4px;
        }
        .discount-tag {
            background: rgba(228, 194, 75, 0.15);
            color: #e4c24b;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .badges-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 24px;
        }
        .use-badge {
            background: #1a1b1f;
            border: 1px solid rgba(255,255,255,0.08);
            color: #bbb;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
        }

        .highlights-list {
            list-style: none;
            padding: 0;
            margin: 0 0 30px;
            color: #ccc;
        }
        .highlights-list li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .highlights-list li::before {
            content: '✓';
            color: #e4c24b;
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        /* --- MODERN BUY BOX --- */
        .modern-buy-box {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 0;
            padding: 24px;
            position: sticky;
            top: 100px;
        }
        
        .stock-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #00d369;
            font-weight: 600;
            font-size: 14px;
            background: rgba(0, 211, 105, 0.1);
            padding: 4px 10px;
            border-radius: 6px;
            margin-bottom: 16px;
        }

        .delivery-eta {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 24px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        .delivery-eta i { color: #e4c24b; margin-top: 3px; }

        .control-label {
            font-size: 13px;
            color: #fff;
            font-weight: 600;
            margin-bottom: 10px;
            display: block;
        }

        .custom-select {
            width: 100%;
            background: #121315;
            border: 1px solid rgba(255,255,255,.12);
            color: #fff;
            padding: 12px 16px;
            border-radius: 0;
            margin-bottom: 24px;
            font-size: 14px;
            outline: none;
            appearance: none;
        }
        .custom-select:focus { border-color: #e4c24b; }

        .customization-panel {
            background: transparent;
            border: none;
            padding: 0;
            margin-bottom: 24px;
        }
        .custom-check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #ccc;
            cursor: pointer;
        }
        .custom-check input {
            width: 16px; height: 16px;
            accent-color: #e4c24b;
        }
        .custom-textarea {
            width: 100%;
            background: #121315;
            border: 1px solid rgba(255,255,255,.12);
            color: #fff;
            padding: 14px 18px;
            border-radius: 0;
            font-size: 14px;
            resize: none;
            outline: none;
        }
        .custom-textarea:focus { border-color: #e4c24b; }

        .btn-primary-lux {
            width: 100%;
            background: linear-gradient(90deg, #e4c24b, #f0d05a);
            color: #111;
            border: none;
            padding: 18px 24px;
            border-radius: 0;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-size: 13px;
            margin-bottom: 14px;
            transition: opacity 0.3s ease;
            cursor: pointer;
        }
        .btn-primary-lux:hover { opacity: 0.95; transform: none; }

        .btn-secondary-lux {
            width: 100%;
            background: transparent;
            border: 1px solid rgba(255,255,255,.14);
            color: #fff;
            padding: 16px 24px;
            border-radius: 0;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 13px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .btn-secondary-lux:hover { background: rgba(255,255,255,0.05); }

        .secure-badge {
            font-size: 12px;
            color: #888;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        /* --- TABS SECTION --- */
        .content-tabs {
            margin-top: 60px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 40px;
        }
        .tab-button {
            background: none;
            border: none;
            color: #888;
            font-size: 16px;
            font-weight: 600;
            padding: 0 0 16px;
            cursor: pointer;
            position: relative;
            transition: 0.3s;
        }
        .tab-button:hover { color: #fff; }
        .tab-button.active { color: #e4c24b; }
        .tab-button.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #e4c24b;
        }

        .tab-content {
            padding: 40px 0;
            color: #ccc;
        }

        /* --- SPECS TABLE --- */
        .modern-table {
            width: 100%;
            border-collapse: collapse;
            background: transparent;
            border-radius: 0;
            overflow: hidden;
        }
        .modern-table th, .modern-table td {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            font-size: 14px;
            text-align: left;
            color: rgba(255, 255, 255, 0.68);
        }
        .modern-table th {
            width: 30%;
            background: transparent;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
        }
        .modern-table tr:last-child th, .modern-table tr:last-child td {
            border-bottom: none;
        }

        /* --- REVIEWS --- */
        .review-card {
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            border-radius: 0;
            padding: 24px 0;
            margin-bottom: 0;
        }
        .review-card:last-child {
            border-bottom: none;
        }
        .reviewer-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        }
        .reviewer-avatar {
            width: 40px; height: 40px;
            background: #222;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 600; color: #fff;
        }
        .reviewer-name { font-weight: 600; color: #fff; font-size: 15px; }
        .verified-tag { color: #e4c24b; font-size: 12px; margin-left: 8px;}
        .review-card p { margin: 12px 0 0; font-size: 14px; color: #bbb; }

        /* --- RELATED PRODUCTS --- */
        .related-card {
            background: #111214;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 0;
            padding: 18px;
            text-align: left;
            transition: 0.3s;
            height: 100%;
        }
        .related-card:hover {
            transform: translateY(-6px);
            border-color: rgba(228, 194, 75, 0.25);
        }
        .related-card img {
            width: 100%;
            height: auto;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 0;
            margin-bottom: 18px;
        }
        .related-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            color: #fff;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .related-price {
            color: #e4c24b;
            font-size: 16px;
            font-weight: 700;
        }



      `}</style>

      <div id="modern-product-page">
        {/* MAIN CONTENT */}
        <section className="product-main">
          <div className="container-fluid px-4 px-xl-5">
            <div className="lux-breadcrumb">
              <Link to="/catalog">Home</Link> / <Link to="/catalog">{product.category}</Link> / <span className="active">{product.name}</span>
            </div>

            <div className="row g-5">
              {/* LEFT: GALLERY */}
              <div className="col-lg-5">
                <div className="gallery-wrapper">
                  <div className="main-image-container">
                    <img src={mainImage || product.image} alt={product.name} />
                  </div>
                  <div className="thumb-strip">
                    {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        className={mainImage === img || (!mainImage && idx === 0) ? 'active' : ''} 
                        onClick={() => setMainImage(img)} 
                        alt={`Thumbnail ${idx + 1}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* MIDDLE: INFO */}
              <div className="col-lg-4">
                <div className="product-tagline">{product.category} Collection</div>
                <h1 className="product-title">{product.name}</h1>
                
                <div className="reviews-summary">
                  <span className="stars">★★★★★</span>
                  <span className="text-white-50">4.8</span>
                  <span className="review-text" onClick={() => setActiveTab('reviews')}>(48 Reviews)</span>
                </div>

                <div className="price-wrap">
                  <span className="current-price">₹{product.price.toLocaleString()}</span>
                  <div className="d-flex flex-column">
                    <span className="original-price">₹{originalPrice.toLocaleString()}</span>
                    <span className="discount-tag">Save 15%</span>
                  </div>
                </div>

                <div className="badges-container">
                  <span className="use-badge">Corporate Award</span>
                  <span className="use-badge">Sports Tournament</span>
                  <span className="use-badge">Employee Recognition</span>
                </div>

                <div className="mt-4 mb-3">
                  <strong className="text-white">Product Highlights</strong>
                </div>
                <ul className="highlights-list">
                  <li>Handcrafted from premium optical K9 crystal.</li>
                  <li>Features stunning 24K mirror polish inlays.</li>
                  <li>Arrives in a secure, velvet-lined luxury box.</li>
                  <li>Ample base space for detailed laser personalization.</li>
                </ul>
              </div>

              {/* RIGHT: BUY BOX */}
              <div className="col-lg-3">
                <div className="modern-buy-box">
                  <div className="stock-indicator"><i className="fa-solid fa-circle-check"></i> In Stock Ready to Ship</div>
                  
                  <div className="delivery-eta">
                    <i className="fa-solid fa-truck"></i>
                    <div>
                      <strong>Free Fast Delivery</strong><br/>
                      Order within 2 hrs to get it by tomorrow.
                    </div>
                  </div>

                  <label className="control-label">Select Size / Scale</label>
                  <select 
                    className="custom-select"
                    value={selectedScale}
                    onChange={(e) => setSelectedScale(e.target.value)}
                  >
                    <option value='10" Grand'>10" Grand Edition</option>
                    <option value='12" Elite'>12" Elite Edition (+₹50)</option>
                    <option value='15" Apex'>15" Apex Edition (+₹120)</option>
                  </select>

                  <div className="customization-panel" ref={customizeRef}>
                    <label className="control-label text-warning mb-3"><i className="fa-solid fa-pen-nib me-2"></i>Personalization</label>
                    <label className="custom-check">
                      <input type="checkbox" checked={needsLogo} onChange={(e)=>setNeedsLogo(e.target.checked)} />
                      Add Company Logo
                    </label>
                    <label className="custom-check">
                      <input type="checkbox" checked={needsEventTitle} onChange={(e)=>setNeedsEventTitle(e.target.checked)} />
                      Add Event Title
                    </label>
                    <textarea
                      rows="3"
                      className="custom-textarea mt-2"
                      placeholder="Enter Engraving Text..."
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                    />
                  </div>

                  <button className="btn-primary-lux" onClick={() => { handleAddToCart(); navigate('/cart'); }}>Buy Now</button>
                  <button className="btn-secondary-lux" onClick={handleAddToCart}>Add to Cart</button>
                  
                  <div className="secure-badge">
                    <i className="fa-solid fa-lock"></i> Secure SSL Transaction
                  </div>
                </div>
              </div>
            </div>

            {/* TABBED DETAILS SECTION */}
            <div className="row mt-5">
              <div className="col-lg-9">
                <div className="content-tabs">
                  <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                  <button className={`tab-button ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
                  <button className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>Shipping & Returns</button>
                  <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                </div>

                <div className="tab-content">
                  {activeTab === 'description' && (
                    <div className="animate__animated animate__fadeIn">
                      <h4 className="text-white mb-3">About {product.name}</h4>
                      <p>{product.description} Designed to capture the pinnacle of achievement, this exclusive piece stands as a permanent testament to dedication and success. Whether awarded at high-stakes corporate galas or prestigious sporting events, its weight and finish convey immediate value and prestige.</p>
                      <p>Our master artisans employ a meticulous 7-step polishing process, ensuring every edge catches the light perfectly. The base is engineered specifically to accommodate detailed laser engraving without compromising the structural integrity of the award.</p>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="animate__animated animate__fadeIn">
                      <table className="modern-table">
                        <tbody>
                          <tr>
                            <th>Primary Material</th>
                            <td>{product.material || "K9 Optical Crystal"}</td>
                          </tr>
                          <tr>
                            <th>Color / Finish</th>
                            <td>Clear Translucent with Polished Gold Accents</td>
                          </tr>
                          <tr>
                            <th>Dimensions</th>
                            <td>{product.scale || '10"'} Height x 4.5" Base</td>
                          </tr>
                          <tr>
                            <th>Weight</th>
                            <td>4.2 kg (9.2 lbs)</td>
                          </tr>
                          <tr>
                            <th>Packaging</th>
                            <td>Velvet-lined presentation box</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="animate__animated animate__fadeIn">
                      <h5 className="text-white mb-3">Delivery Information</h5>
                      <ul className="mb-4">
                        <li><strong>Standard Delivery:</strong> 3-5 business days.</li>
                        <li><strong>Expedited Shipping:</strong> Next-day delivery available.</li>
                        <li><strong>Packaging:</strong> Arrives in a secure, velvet-lined presentation box preventing any transit damage.</li>
                      </ul>
                      
                      <h5 className="text-white mb-3">Return Policy & Warranty</h5>
                      <ul>
                        <li><strong>30-Day Returns:</strong> Eligible for return or replacement within 30 days of receipt. Note: Custom engraved items are non-refundable unless damaged.</li>
                        <li><strong>1-Year Warranty:</strong> Covers manufacturing defects and tarnishing.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="animate__animated animate__fadeIn">
                      <div className="review-card">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">MT</div>
                          <div>
                            <div className="reviewer-name">Michael T. <span className="verified-tag"><i className="fa-solid fa-circle-check"></i> Verified</span></div>
                            <div className="stars">★★★★★</div>
                          </div>
                        </div>
                        <p>The weight and quality of this trophy are incredible. We ordered 15 for our annual corporate awards, and the engraving was flawless. Highly recommended.</p>
                      </div>

                      <div className="review-card">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">SL</div>
                          <div>
                            <div className="reviewer-name">Sarah L. <span className="verified-tag"><i className="fa-solid fa-circle-check"></i> Verified</span></div>
                            <div className="stars">★★★★★</div>
                          </div>
                        </div>
                        <p>Absolutely gorgeous. Arrived in a beautiful velvet box, perfectly protected. The gold finish looks very premium.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-lg-3 d-none d-lg-block">
                <div className="p-4 bg-dark rounded-4 mt-5 border border-secondary border-opacity-25">
                  <h6 className="text-white mb-3">Need Help?</h6>
                  <p className="small text-white-50 mb-3">Our concierge team is ready to assist you with bulk orders and bespoke customization inquiries.</p>
                  <Link to="/contact" className="btn btn-outline-light btn-sm w-100">Contact Us</Link>
                </div>
              </div>
            </div>

            {/* RELATED PRODUCTS */}
            <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
              <h3 className="text-white mb-4">Related Masterpieces</h3>
              <div className="row g-4">
                {relatedProducts.map(relProduct => (
                  <div className="col-md-3 col-6" key={relProduct.id}>
                    <Link to={`/product/${relProduct.id}`}>
                      <div className="related-card">
                        <img src={relProduct.image} alt={relProduct.name} />
                        <div className="related-title">{relProduct.name}</div>
                        <div className="stars small mb-2">★★★★★</div>
                        <div className="related-price">₹{relProduct.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  );
};

export default ProductDetail;
