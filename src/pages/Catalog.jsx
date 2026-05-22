import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const Catalog = ({ allProducts, onAddToCart, cartCount }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Toggle Category Filter
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle Material Filter
  const handleMaterialChange = (material) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price <= maxPrice;
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.some(mat => product.materials && product.materials.includes(mat));
      return matchesCategory && matchesPrice && matchesMaterial;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allProducts, selectedCategories, maxPrice, selectedMaterials, sortBy]);

  const categoriesList = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean).sort();
  }, [allProducts]);

  const materialsList = useMemo(() => {
    const mats = new Set();
    allProducts.forEach(p => {
      if (p.materials && Array.isArray(p.materials)) {
        p.materials.forEach(m => mats.add(m));
      }
    });
    return Array.from(mats).sort();
  }, [allProducts]);

  return (
    <>
      <style>{`
        .collection-page {
            background:
                radial-gradient(circle at top center, rgba(212,175,55,.05), transparent 35%),
                #050505;
            min-height: 100vh;
            color: #f5f1e8;
            font-family: 'Inter', sans-serif;
        }

        /* Header styles moved to App.jsx */

        .breadcrumb-custom {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 20px;
        }

        .breadcrumb-custom span {
            color: #fff;
        }

        .page-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 86px;
            font-weight: 700;
            line-height: .95;
            margin-bottom: 18px;
        }

        .page-subtitle {
            color: #d0d0d0;
            font-size: 22px;
            line-height: 1.7;
            max-width: 850px;
            margin-bottom: 60px;
        }

        .filter-section {
            border-top: 1px solid rgba(255,255,255,.08);
            padding-top: 26px;
            margin-top: 26px;
        }

        .filter-section h6 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 34px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #f5f1e8;
        }

        .filter-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ddd;
            margin-bottom: 14px;
            font-size: 16px;
        }

        .filter-option input {
            accent-color: #d4af37;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .material-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .tag-btn {
            border: 1px solid rgba(255,255,255,.15);
            background: transparent;
            color: #ddd;
            padding: 10px 16px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .tag-btn.active {
            background: #d4af37;
            color: #111;
            border-color: #d4af37;
        }

        .btn-apply {
            width: 100%;
            background: #f3f3f3;
            color: #111;
            border: none;
            padding: 15px;
            margin-top: 30px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .btn-apply:hover {
            background: #d4af37;
        }

        .sort-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 30px;
        }

        .sort-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-right: 10px;
        }

        .sort-select {
            background: transparent;
            border: none;
            color: #d4af37;
            font-weight: 600;
            cursor: pointer;
            outline: none;
        }

        .sort-select option {
            background: #111;
            color: #fff;
        }

        .product-card {
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 0;
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
            display: block;
            margin: 0;
            transition: transform 0.5s ease;
        }

        .product-card:hover .product-image img {
            transform: scale(1.08);
        }

        .badge-custom {
            position: absolute;
            top: 14px;
            left: 14px;
            background: #d4af37;
            color: #111;
            font-size: 11px;
            font-weight: 700;
            padding: 6px 10px;
            letter-spacing: .6px;
            text-transform: uppercase;
            z-index: 2;
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

        .product-name {
            font-size: 1.8rem;
            font-family: 'Cormorant Garamond', serif;
            margin: 0 0 16px;
            color: #fff;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .product-card:hover .product-name {
            color: var(--gold);
        }

        .product-meta {
            color: rgba(255,255,255,0.5);
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .product-price {
            color: var(--gold);
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 4px;
            margin-bottom: 16px;
        }

        .btn-outline-gold {
            width: 100%;
            border: 1px solid rgba(212,175,55,.6);
            background: transparent;
            color: #fff;
            padding: 12px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s ease;
        }

        .btn-outline-gold:hover {
            background: #d4af37;
            color: #111;
        }

        .pagination-dark .page-link {
            background: #111;
            color: #ccc;
            border: 1px solid rgba(255,255,255,.08);
            min-width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .pagination-dark .page-item.active .page-link {
            background: #d4af37;
            color: #111;
            border-color: #d4af37;
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
        }

        .footer-text {
            color: #a8a8a8;
            line-height: 1.8;
            margin-top: 20px;
        }

        .footer-title {
            color: #d4af37;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 18px;
        }

        .footer-links a {
            display: block;
            color: #d4d4d4;
            text-decoration: none;
            margin-bottom: 12px;
        }

        .footer-links a:hover {
            color: #d4af37;
        }

        .newsletter-input {
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(212,175,55,.4);
            color: #fff;
            width: 100%;
            padding: 10px 0;
            outline: none;
        }

        .footer-bottom {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,.04);
            color: #666;
            font-size: 13px;
        }

        .social-links a {
            color: #bbb;
            margin-left: 18px;
            text-decoration: none;
        }

        .social-links a:hover {
            color: #d4af37;
        }

        @media (max-width: 991px) {
            .page-title {
                font-size: 58px;
            }

            .page-subtitle {
                font-size: 18px;
            }

            .sort-box {
                justify-content: flex-start;
                margin-top: 30px;
            }

            .footer-brand {
                font-size: 52px;
            }
        }
      `}</style>

      <div className="collection-page">
        {/* Header managed by App.jsx */}

        {/* MAIN */}
        <section className="py-5">
          <div className="container-fluid px-5">
            {/* HERO */}
            <div className="breadcrumb-custom">Home / <span>Collections</span></div>

            <h1 className="page-title">Elite Collections</h1>
            <p className="page-subtitle">
              Discover a curated selection of championship-grade trophies,
              crafted with precision for those who redefine excellence.
            </p>

            <div className="row g-5">
              {/* FILTER SIDEBAR */}
              <div className="col-lg-3">
                <div className="filter-section mt-0 pt-0 border-0">
                  <h6>Category</h6>
                  {categoriesList.map(category => (
                    <div className="filter-option" key={category}>
                      <span>{category}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                    </div>
                  ))}
                </div>

                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-end mb-3">
                    <h6 className="mb-0">Price Range</h6>
                    <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '18px', fontFamily: 'Inter, sans-serif' }}>Up to ₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="500"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted small mt-1">
                    <span>₹500</span>
                    <span>₹5,000+</span>
                  </div>
                </div>

                <div className="filter-section">
                  <h6>Material</h6>
                  <div className="material-tags">
                    {materialsList.map(material => (
                      <button
                        key={material}
                        className={`tag-btn ${selectedMaterials.includes(material) ? 'active' : ''}`}
                        onClick={() => handleMaterialChange(material)}
                      >
                        {material}
                      </button>
                    ))}
                  </div>

                  <button className="btn-apply" onClick={() => {
                    setSelectedCategories([]);
                    setMaxPrice(5000);
                    setSelectedMaterials([]);
                  }}>
                    <i className="fa-solid fa-rotate-left me-2"></i>
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="col-lg-9">
                <div className="sort-box">
                  <span className="sort-label">Sort By:</span>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest Collection</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-magnifying-glass mb-4" style={{ fontSize: '48px', color: '#d4af37' }}></i>
                    <h4>No Products Found</h4>
                    <p className="text-muted">Try relaxing your filter criteria to discover more products.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredProducts.map((product) => (
                      <div className="col-md-6 col-xl-4" key={product.id}>
                        <div className="product-card position-relative">
                          {product.customizable && <span className="badge-custom">Customizable</span>}
                          <div className="product-image">
                            <Link to={`/product/${product.id}`}>
                              <img src={product.image} alt={product.name} />
                            </Link>
                          </div>
                          <div className="product-body">
                            <div>
                              <div className="product-category">{product.category}</div>
                              <h3 className="product-name">{product.name}</h3>
                            </div>
                            <div>
                              <div className="product-price">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              <button className="btn-outline-gold" onClick={() => onAddToCart(product)}>
                                Add to Bag
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PAGINATION */}
                {filteredProducts.length > 0 && (
                  <nav className="mt-5">
                    <ul className="pagination pagination-dark justify-content-center">
                      <li className="page-item"><span className="page-link"><i className="fa-solid fa-chevron-left"></i></span></li>
                      <li className="page-item active"><span className="page-link">1</span></li>
                      <li className="page-item"><span className="page-link">2</span></li>
                      <li className="page-item"><span className="page-link">3</span></li>
                      <li className="page-item"><span className="page-link"><i className="fa-solid fa-chevron-right"></i></span></li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="container-fluid px-5">
            <div className="row g-5">
              <div className="col-lg-3">
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

              <div className="col-lg-3">
                <div className="footer-title">Newsletter</div>
                <p className="footer-text mb-3">
                  Receive exclusive previews of new collections.
                </p>
                <input type="email" className="newsletter-input" placeholder="Email Address" />
              </div>
            </div>

            <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
              <div>© 2026 Aurelian Trophies. Excellence in Craftsmanship.</div>
              <div className="social-links">
                <a href="#ig">Instagram</a>
                <a href="#ln">LinkedIn</a>
                <a href="#pn">Pinterest</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Catalog;
