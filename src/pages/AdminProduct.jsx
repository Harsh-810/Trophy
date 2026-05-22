import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';
import Swal from 'sweetalert2';

const AdminProduct = ({ currentUser, products = [], onAddProduct, onDeleteProduct, onUpdateProduct }) => {
  const { triggerNotification } = useNotification();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Form Fields for product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Sculpture Series');
  const [image, setImage] = useState('https://imgs.search.brave.com/PrGjkO76YSXtg2aWowkvXbdhD6tx9lLyP0W0ec2JCqU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE4Lzk1LzcxLzM0/LzM2MF9GXzE4OTU3/MTM0MzZfVm9FSzdw/R3B6b2FuWm5BUGN3/czZMT3R3TFd5d2s0/dkcuanBn');
  const [images, setImages] = useState([]);
  const [tempUrl, setTempUrl] = useState('');
  const [description, setDescription] = useState('');
  const [scale, setScale] = useState('12" Standard');
  const [material, setMaterial] = useState('24K Polished Gold Inlay');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('Aurelian');
  const [discount, setDiscount] = useState('0');

  // Protect Admin Route
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-5" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <i className="fa-solid fa-lock mb-4" style={{ fontSize: '64px', color: '#d4af37' }}></i>
        <h2>Admin Access Only</h2>
        <p className="text-muted">You do not have the required admin permissions to view this page.</p>
        <div className="mt-4">
          <Link to="/" className="btn btn-outline-gold px-4" style={{ border: '1px solid #d4af37', color: '#d4af37' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  const handleStartEdit = (prod) => {
    setEditProductId(prod.id);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setImage(prod.image);
    setImages(prod.images || (prod.image ? [prod.image] : []));
    setDescription(prod.description);
    setScale(prod.scale || '12" Standard');
    setMaterial(prod.material || '24K Polished Gold Inlay');
    setSku(prod.sku || '');
    setStock(prod.stock !== undefined ? String(prod.stock) : '10');
    setBrand(prod.brand || 'Aurelian');
    setDiscount(prod.discount !== undefined ? String(prod.discount) : '0');
    setShowAddForm(true);
  };

  const cancelForge = () => {
    setEditProductId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setImages([]);
    setTempUrl('');
    setSku('');
    setStock('');
    setBrand('Aurelian');
    setDiscount('0');
    setShowAddForm(!showAddForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      triggerNotification('Please fill out all fields.', 'error');
      return;
    }

    const finalImages = images.length > 0 ? images : (image ? [image] : []);
    const primaryImage = finalImages[0] || 'https://imgs.search.brave.com/PrGjkO76YSXtg2aWowkvXbdhD6tx9lLyP0W0ec2JCqU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE4Lzk1LzcxLzM0/LzM2MF9GXzE4OTU3/MTM0MzZfVm9FSzdw/R3B6b2FuWm5BUGN3/czZMT3R3TFd5d2s0/dkcuanBn';

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    const finalSku = sku.trim() || `AUR-${Math.floor(1000 + Math.random() * 9000)}`;

    if (editProductId) {
      const updatedProduct = {
        id: editProductId,
        name,
        price: parsedPrice,
        category,
        image: primaryImage,
        images: finalImages,
        description,
        scale,
        material,
        sku: finalSku,
        stock: parsedStock,
        brand: brand.trim() || 'Aurelian',
        discount: parsedDiscount
      };
      if (onUpdateProduct) onUpdateProduct(updatedProduct);
      triggerNotification(`Product "${name}" has been revised successfully.`, 'success', 'Product Curation');
    } else {
      const newProduct = {
        id: String(Date.now()),
        name,
        price: parsedPrice,
        category,
        image: primaryImage,
        images: finalImages,
        description,
        scale,
        material,
        sku: finalSku,
        stock: parsedStock,
        brand: brand.trim() || 'Aurelian',
        discount: parsedDiscount
      };
      onAddProduct(newProduct);
      triggerNotification(`Product "${name}" has been forged and loaded into collections.`, 'success', 'Product Forged');
    }

    // Reset Form fields
    setEditProductId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setImages([]);
    setTempUrl('');
    setSku('');
    setStock('');
    setBrand('Aurelian');
    setDiscount('0');
    setShowAddForm(false);
  };

  return (
    <>
      <style>{`
        .admin-product-page .admin-dark-main {
          padding: 24px 32px;
        }
        .admin-product-page .admin-dark-title {
          font-size: 28px;
          margin-bottom: 0px;
        }
        .admin-product-page .admin-dark-breadcrumb {
          margin-bottom: 8px;
          font-size: 11px;
        }
        .admin-product-page .btn-forge-product {
          padding: 8px 16px;
          font-size: 12px;
          border-radius: 5px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .admin-product-page .dark-panel {
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .admin-product-page .dark-panel-header {
          padding: 12px 20px;
        }
        .admin-product-page .dark-panel-title {
          font-size: 15px;
        }
        .admin-product-page .form-control-dark,
        .admin-product-page .form-select-dark {
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 5px;
          height: 36px;
        }
        .admin-product-page textarea.form-control-dark {
          height: auto;
          min-height: 80px;
        }
        .admin-product-page .form-label {
          margin-bottom: 4px;
          font-size: 11px;
          letter-spacing: 0.5px;
        }
        .admin-product-page .dark-table th {
          padding: 10px 16px;
          font-size: 11px;
          letter-spacing: 0.5px;
        }
        .admin-product-page .dark-table td {
          padding: 10px 16px;
          font-size: 13px;
        }
        .admin-product-page .dark-product {
          gap: 10px;
        }
        .admin-product-page .dark-product img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .admin-product-page .dark-product-name {
          font-size: 14px;
          margin-bottom: 0px;
        }
        .admin-product-page .dark-product-sku {
          font-size: 11px;
        }
        .admin-product-page .btn-delete-product {
          padding: 5px 12px;
          font-size: 12px;
          border-radius: 5px;
        }
        .admin-product-page .btn-outline-warning {
          padding: 5px 12px !important;
          font-size: 12px !important;
          border-radius: 5px !important;
        }
        .admin-product-page .form-control-dark::placeholder {
          font-size: 13px;
          opacity: 0.6;
        }
      `}</style>

      <div className="admin-dark-dashboard admin-product-page">
        {/* SIDEBAR */}
        <aside className="admin-dark-sidebar">
          <div className="admin-dark-brand">
            <h2>Aurelian</h2>
            <p>Admin Dashboard</p>
          </div>

          <ul className="admin-dark-nav">
            <li>
              <Link to="/admin">
                <i className="fa-solid fa-chart-pie"></i> Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="active">
                <i className="fa-solid fa-trophy"></i> Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <i className="fa-solid fa-receipt"></i> Orders
              </Link>
            </li>
          <li>
            <Link to="/admin/custom-orders">
              <i className="fa-solid fa-compass-drafting"></i> Custom Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/inquiries">
              <i className="fa-regular fa-envelope"></i> Inquiries
            </Link>
          </li>
            <li>
              <Link to="/admin/coupons">
                <i className="fa-solid fa-tags"></i> Coupons
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <i className="fa-solid fa-user-shield"></i> Users
              </Link>
            </li>
          </ul>

          <div className="admin-dark-sidebar-footer">
            <Link to="/" className="btn btn-admin-dark d-block text-center py-3 text-dark">
              Exit Admin Console
            </Link>

            <div className="admin-dark-user">
              <img src={currentUser.avatar} alt="Admin" />
              <div>
                <div className="admin-dark-user-name">{currentUser.name}</div>
                <div className="admin-dark-user-role">Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="admin-dark-main">
          <div className="admin-dark-breadcrumb">
            Admin Console &nbsp;/&nbsp; <span className="active-crumb">Product Curation</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="admin-dark-title mb-0">Product Details</h1>
            <button className="btn-forge-product w-20" onClick={() => showAddForm ? cancelForge() : setShowAddForm(true)}>
              {showAddForm ? 'Cancel Operation' : 'Add New Product'}
            </button>
          </div>

          {/* ADD / EDIT PRODUCT FORM */}
{showAddForm && (
  <div className="dark-panel p-3 mb-4" style={{ background: '#121213' }}>
    <h3 className="dark-panel-title mb-3">
      {editProductId ? 'Edit Product' : 'Add Product'}
    </h3>

    <form onSubmit={handleSubmit} className="row g-3">
      
      {/* Product Name */}
      <div className="col-md-6">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Product Name
        </label>

        <input
          type="text"
          className="form-control-dark"
          placeholder="e.g., The Sovereign Laurel Award"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Price */}
      <div className="col-md-6">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Investment Price (INR)
        </label>

        <input
          type="number"
          className="form-control-dark"
          placeholder="e.g., 14500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      {/* Category */}
      <div className="col-md-4">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Collection Category
        </label>

        <select
          className="form-select-dark"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Sculpture Series">Sculpture Series</option>
          <option value="Prestige Columns">Prestige Columns</option>
          <option value="Aurelian Shields">Aurelian Shields</option>
          <option value="Obsidian Medals">Obsidian Medals</option>
          <option value="Other">Other</option>
        </select>

        {category === 'Other' && (
          <input
            type="text"
            className="form-control-dark mt-2"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}
      </div>

      {/* Material */}
      <div className="col-md-4">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Master Material
        </label>

        <select
          className="form-select-dark"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          <option value="24K Polished Gold Inlay">
            24K Polished Gold Inlay
          </option>

          <option value="K9 Optical Solid Crystal">
            K9 Optical Solid Crystal
          </option>

          <option value="Vitreous Obsidian geological block">
            Vitreous Obsidian geological block
          </option>

          <option value="Polished Platinum Ribbons">
            Polished Platinum Ribbons
          </option>

          <option value="Other">Other</option>
        </select>

        {material === 'Other' && (
          <input
            type="text"
            className="form-control-dark mt-2"
            placeholder="Enter custom material"
            value={customMaterial}
            onChange={(e) => setCustomMaterial(e.target.value)}
          />
        )}
      </div>

      {/* Scale */}
      <div className="col-md-4">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Exhibitor Scale
        </label>

        <select
          className="form-select-dark"
          value={scale}
          onChange={(e) => setScale(e.target.value)}
        >
          <option value='10" Grand scale'>10" Grand scale</option>
          <option value='12" Standard scale'>12" Standard scale</option>
          <option value='15" Exhibition scale'>15" Exhibition scale</option>
          <option value="Other">Other</option>
        </select>

        {scale === 'Other' && (
          <input
            type="text"
            className="form-control-dark mt-2"
            placeholder="Enter custom scale"
            value={customScale}
            onChange={(e) => setCustomScale(e.target.value)}
          />
        )}
      </div>

      {/* Brand Name */}
      <div className="col-md-3">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Brand Name
        </label>
        <input
          type="text"
          className="form-control-dark"
          placeholder="e.g., Aurelian"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>

      {/* SKU */}
      <div className="col-md-3">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Product SKU (Optional)
        </label>
        <input
          type="text"
          className="form-control-dark"
          placeholder="e.g., AUR-8012"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>

      {/* Stock Quantity */}
      <div className="col-md-3">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Stock Quantity
        </label>
        <input
          type="number"
          className="form-control-dark"
          placeholder="e.g., 10"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>

      {/* Discount */}
      <div className="col-md-3">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Discount (%)
        </label>
        <input
          type="number"
          className="form-control-dark"
          placeholder="e.g., 10"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div className="col-md-12">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Curated Product Images (Select Multi Images)
        </label>

        {/* File Upload (Multiple) */}
        <input
          type="file"
          accept="image/*"
          multiple
          className="form-control-dark"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              const newUrls = files.map(file => URL.createObjectURL(file));
              setImages(prev => [...prev, ...newUrls]);
            }
          }}
        />

        {/* External URL Entry */}
        <div className="d-flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="form-control-dark flex-grow-1"
            style={{ height: '36px', fontSize: '13px' }}
          />
          <button
            type="button"
            onClick={() => {
              if (tempUrl.trim()) {
                setImages(prev => [...prev, tempUrl.trim()]);
                setTempUrl('');
              }
            }}
            className="btn btn-outline-gold px-3"
            style={{ border: '1px solid #d4af37', color: '#d4af37', minWidth: '100px', height: '36px', background: 'transparent', padding: '0 15px', fontSize: '13px' }}
          >
            Add URL
          </button>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {images.map((url, idx) => (
              <div key={idx} className="position-relative" style={{ width: '90px', height: '90px', borderRadius: '8px', border: idx === 0 ? '2px solid #d4af37' : '1px solid #2a2a2a', overflow: 'hidden', background: '#0e0e0e' }}>
                <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Primary Badge */}
                {idx === 0 && (
                  <span style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(212, 175, 55, 0.95)', color: '#000', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', padding: '2px 0' }}>
                    Primary
                  </span>
                )}
                
                {/* Set Primary Button */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...images];
                      const item = copy.splice(idx, 1)[0];
                      copy.unshift(item);
                      setImages(copy);
                    }}
                    style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: '#d4af37', border: '1px solid #d4af37', fontSize: '9px', borderRadius: '4px', padding: '2px 0', cursor: 'pointer' }}
                  >
                    Set Primary
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => {
                    setImages(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: '#ff4d4f', color: '#fff', border: 'none', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="col-md-12">
        <label className="form-label text-muted small text-uppercase font-weight-bold">
          Philosophy & Description
        </label>

        <textarea
          rows="3"
          className="form-control-dark"
          placeholder="Enter the background story of this product..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Submit */}
      <div className="col-md-12 text-end mt-3">
        <button type="submit" className="btn-forge-product">
          {editProductId ? 'Confirm Revisions' : 'Add Product'}
        </button>
      </div>

    </form>
  </div>
)}
          {/* PRODUCTS LIST PANEL */}
          <div className="dark-panel">
            <div className="dark-panel-header">
              <h3 className="dark-panel-title">Active Curated Products</h3>
              <span className="text-muted small">{products.length} Items Listed</span>
            </div>

            <div className="table-responsive">
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>Collection Product</th>
                    <th>Material & SKU</th>
                    <th>Stock & Brand</th>
                    <th>Investment Value</th>
                    <th className="text-end">Curation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No products are loaded in this collection yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => {
                      const lowStockThreshold = parseInt(localStorage.getItem('lowStockAlertThreshold') || '5');
                      const isLowStock = (prod.stock !== undefined ? prod.stock : 10) <= lowStockThreshold;
                      return (
                        <tr key={prod.id}>
                          <td>
                            <div className="dark-product">
                              <img src={prod.image} alt={prod.name} />
                              <div>
                                <div className="dark-product-name">{prod.name}</div>
                                <div className="dark-product-sku">Category: {prod.category}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div><strong>{prod.material || 'Premium Alloy'}</strong></div>
                            <div className="text-muted-dark">SKU: {prod.sku || `AUR-${1000 + prod.id}`}</div>
                          </td>
                          <td>
                            <div>Brand: <strong>{prod.brand || 'Aurelian'}</strong></div>
                            <div className="mt-1">
                              {isLowStock ? (
                                <span className="badge bg-danger text-white px-2 py-1" style={{ fontSize: '10px', borderRadius: '4px', fontWeight: '600' }}>
                                  Low Stock ({prod.stock !== undefined ? prod.stock : 0})
                                </span>
                              ) : (
                                <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px', borderRadius: '4px', fontWeight: '600' }}>
                                  In Stock ({prod.stock !== undefined ? prod.stock : 10})
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {prod.discount > 0 ? (
                              <div>
                                <span className="text-decoration-line-through text-muted small me-2">₹{prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                <strong className="text-warning">₹{(prod.price * (1 - prod.discount / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                                <span className="text-danger small d-block">({prod.discount}% Off)</span>
                              </div>
                            ) : (
                              <strong className="text-warning">₹{prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                            )}
                          </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-warning me-3" style={{ border: '1px solid rgba(228,194,75,0.4)', color: '#e4c24b', padding: '4px 10px', fontSize: '12px', background: 'transparent' }} onClick={() => handleStartEdit(prod)}>
                            Revise
                          </button>
                          <button className="btn-delete-product" onClick={() => {
                             Swal.fire({
                               title: 'Dissolve Master Item?',
                               text: `Are you absolutely sure you wish to dissolve master item "${prod.name}" from collections?`,
                               icon: 'warning',
                               iconColor: '#d4af37',
                               showCancelButton: true,
                               confirmButtonText: 'Dissolve',
                               cancelButtonText: 'Cancel',
                               background: '#111112',
                               color: '#f5f1e8',
                               customClass: {
                                 popup: 'swal2-aurelian-popup',
                                 confirmButton: 'swal2-aurelian-confirm',
                                 cancelButton: 'swal2-aurelian-cancel'
                               },
                               buttonsStyling: false
                             }).then((result) => {
                               if (result.isConfirmed) {
                                 onDeleteProduct(prod.id);
                                 triggerNotification(`Product "${prod.name}" dissolved from collections.`, 'info', 'Product Dissolved');
                               }
                             });
                           }}>
                            Dissolve
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminProduct;
