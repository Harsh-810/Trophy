import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const AdminUser = ({ currentUser, users = [], onUpdateUserRole, onToggleUserBlock }) => {
  const { triggerNotification } = useNotification();

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

  const handleRoleChange = (email, newRole) => {
    if (email === currentUser.email) {
      triggerNotification('You cannot modify your own curatorial clearance!', 'error', 'Clearance Error');
      return;
    }
    onUpdateUserRole(email, newRole);
    triggerNotification(`User clearance updated to ${newRole.toUpperCase()}.`, 'success', 'Clearance Updated');
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
              <Link to="/admin/coupons">
                <i className="fa-solid fa-tags"></i> Coupons
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="active">
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
            Admin Console &nbsp;/&nbsp; <span className="active-crumb">Registry Staff</span>
          </div>

          <h1 className="admin-dark-title">Admins & Clients</h1>

          {/* USERS PANEL */}
          <div className="dark-panel">
            <div className="dark-panel-header">
              <h3 className="dark-panel-title">Active Members Audit Registry</h3>
              <span className="text-muted small">{users.length} Registered Accounts</span>
            </div>

            <div className="table-responsive">
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>Member Profile</th>
                    <th>Email Address</th>
                    <th>Clearance Level</th>
                    <th className="text-end">Admin Auditing</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <div className="dark-product">
                          <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" style={{ borderRadius: '50%' }} />
                          <div>
                            <div className="dark-product-name">{user.name}</div>
                            <div className="text-muted-dark">Aurelian Registry Member</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-light">{user.email}</span>
                      </td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="dark-badge-role d-inline-block mb-1">Admin</span>
                        ) : user.role === 'curator' ? (
                          <span className="badge bg-info text-dark px-3 py-1 font-weight-bold d-inline-block mb-1" style={{ borderRadius: '4px' }}>Curator</span>
                        ) : (
                          <span className="dark-badge-client d-inline-block mb-1">Standard Client</span>
                        )}
                        {user.blocked && (
                          <span className="badge bg-danger text-white px-2 py-1 ms-2" style={{ fontSize: '10px', borderRadius: '4px', fontWeight: '600' }}>SUSPENDED</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <select 
                            className="form-select-dark d-inline-block"
                            style={{ width: '160px', padding: '8px 12px', fontSize: '13px' }}
                            value={user.role || 'client'}
                            onChange={(e) => handleRoleChange(user.email, e.target.value)}
                            disabled={user.email === currentUser.email}
                          >
                            <option value="client">Client</option>
                            <option value="curator">Curator</option>
                            <option value="admin">Master Admin</option>
                          </select>
                          
                          {user.email !== currentUser.email && (
                            <button
                              onClick={() => {
                                onToggleUserBlock(user.email);
                                triggerNotification(
                                  `User ${user.name} has been ${user.blocked ? 're-activated' : 'suspended'} in registry.`,
                                  user.blocked ? 'success' : 'warning',
                                  'Identity Auditing'
                                );
                              }}
                              className={`btn btn-sm ${user.blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                              style={{
                                border: user.blocked ? '1px solid rgba(40,167,69,0.4)' : '1px solid rgba(220,53,69,0.4)',
                                color: user.blocked ? '#28a745' : '#dc3545',
                                padding: '8px 12px',
                                fontSize: '12px',
                                background: 'transparent',
                                borderRadius: '4px',
                                minWidth: '100px',
                                height: '36px'
                              }}
                            >
                              {user.blocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SIMULATED ACTIVITY AUDIT LOGS */}
          <div className="dark-panel mt-4">
            <div className="dark-panel-header">
              <h3 className="dark-panel-title">
                <i className="fa-solid fa-clock-rotate-left text-warning me-2"></i> Recent Registry Audit Events
              </h3>
              <span className="text-muted small">Real-time security pipeline logs</span>
            </div>
            
            <div className="p-3">
              <div className="d-flex flex-column gap-3">
                {[
                  { user: 'harsh@gmail.com', action: 'Added "Sapphire Sovereign Plaque" to wishlist', device: 'Chrome / Windows', time: '5 mins ago', type: 'info' },
                  { user: 'harsh@gmail.com', action: 'Refilled Wallet funds with ₹5,000.00', device: 'Chrome / Windows', time: '12 mins ago', type: 'success' },
                  { user: 'admin@admin.com', action: 'Configured new promo code "ONYXGOLD50" (50% OFF)', device: 'Firefox / macOS', time: '40 mins ago', type: 'warning' },
                  { user: 'lundutelassi@gmail.com', action: 'Authenticated from new device session', device: 'Safari / iPhone 15 Pro', time: '1 hour ago', type: 'info' },
                  { user: 'harsh@gmail.com', action: 'Logged in from Chrome / Windows 11', device: 'Chrome / Windows', time: '2 hours ago', type: 'success' },
                  { user: 'admin@admin.com', action: 'Revoked Active Session of standard client "lundutelassi@gmail.com"', device: 'Firefox / macOS', time: '4 hours ago', type: 'danger' }
                ].map((log, idx) => (
                  <div 
                    key={idx} 
                    className="d-flex justify-content-between align-items-center p-3 border border-secondary border-opacity-10 rounded-3"
                    style={{ background: 'rgba(255, 255, 255, 0.015)' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                        width: '32px',
                        height: '32px',
                        background: log.type === 'success' ? 'rgba(40,167,69,0.1)' : log.type === 'danger' ? 'rgba(220,53,69,0.1)' : log.type === 'warning' ? 'rgba(255,193,7,0.1)' : 'rgba(23,162,184,0.1)',
                        color: log.type === 'success' ? '#28a745' : log.type === 'danger' ? '#dc3545' : log.type === 'warning' ? '#ffc107' : '#17a2b8',
                        flexShrink: 0
                      }}>
                        <i className={`fa-solid ${log.type === 'success' ? 'fa-circle-check' : log.type === 'danger' ? 'fa-circle-xmark' : log.type === 'warning' ? 'fa-shield-halved' : 'fa-circle-info'}`}></i>
                      </div>
                      
                      <div>
                        <div className="text-white font-weight-bold" style={{ fontSize: '13px', textAlign: 'left' }}>
                          <strong className="text-warning me-1">{log.user}</strong> {log.action}
                        </div>
                        <div className="text-muted small mt-1" style={{ fontSize: '11px', textAlign: 'left' }}>
                          Device Session: {log.device}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-muted small text-end" style={{ fontSize: '11px', flexShrink: 0 }}>
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminUser;
