import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';
import Swal from 'sweetalert2';

const AdminCoupon = ({ currentUser, coupons = [], onAddCoupon, onDeleteCoupon }) => {
  const { triggerNotification } = useNotification();
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !discount || !description) {
      triggerNotification('Please fill out all fields.', 'error');
      return;
    }

    const newCoupon = {
      id: Math.max(...coupons.map(c => c.id), 0) + 1,
      code: code.toUpperCase().trim(),
      discount: parseInt(discount),
      description
    };

    onAddCoupon(newCoupon);
    triggerNotification(`Coupon "${code.toUpperCase()}" offering ${discount}% discount has been added.`, 'success', 'Coupon Forged');
    
    // Reset fields
    setCode('');
    setDiscount('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <>
      

      <div className="admin-dark-dashboard">
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
              <Link to="/admin/products">
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
              <Link to="/admin/coupons" className="active">
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
            Admin Console &nbsp;/&nbsp; <span className="active-crumb">Coupons</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1 className="admin-dark-title mb-0">Vault Promotions</h1>
            <button className="btn-forge-product" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel Promotion' : 'Register Promo Code'}
            </button>
          </div>

          {/* ADD PROMO FORM */}
          {showAddForm && (
            <div className="dark-panel p-4 mb-5" style={{ background: '#121213' }}>
              <h3 className="dark-panel-title mb-4">Forge Promotional Campaign</h3>
              
              <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase font-weight-bold">Promo Code</label>
                  <input
                    type="text"
                    className="form-control-dark"
                    placeholder="e.g., ATELIER15"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase font-weight-bold">Discount Percentage (%)</label>
                  <input
                    type="number"
                    className="form-control-dark"
                    placeholder="e.g., 15"
                    min="1"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label text-muted small text-uppercase font-weight-bold">Promotion Background & Details</label>
                  <input
                    type="text"
                    className="form-control-dark"
                    placeholder="e.g., Private curator 15% discount for selected partners"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12 text-end mt-4">
                  <button type="submit" className="btn-forge-product">
                    Add Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* COUPONS TABLE PANEL */}
          <div className="dark-panel">
            <div className="dark-panel-header">
              <h3 className="dark-panel-title">Active Promotion Registry</h3>
              <span className="text-muted small">{coupons.length} Active Campaigns</span>
            </div>

            <div className="table-responsive">
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>Promotion Code</th>
                    <th>Discount Magnitude</th>
                    <th>Campaign Context</th>
                    <th className="text-end">Curation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        No promotional discount campaigns are active.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="coupon-code-span">{c.code}</span>
                        </td>
                        <td>
                          <strong className="text-success">{c.discount}% Discount</strong>
                        </td>
                        <td>
                          <span className="text-light">{c.description}</span>
                        </td>
                        <td className="text-end">
                          <button className="btn-delete-product" onClick={() => {
                            Swal.fire({
                              title: 'Dissolve Promotion?',
                              text: `Are you sure you want to dissolve promo code "${c.code}"?`,
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
                                onDeleteCoupon(c.id);
                                triggerNotification(`Promo campaign "${c.code}" has been dissolved.`, 'info', 'Promo Dissolved');
                              }
                            });
                          }}>
                            Dissolve Campaign
                          </button>
                        </td>
                      </tr>
                    ))
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

export default AdminCoupon;
