import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const AdminCustomOrder = ({ currentUser, bespokeRequests = [], onApproveBespoke, onRejectBespoke, onCrossQuestionBespoke }) => {
  const navigate = useNavigate();
  const { triggerNotification } = useNotification();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-5" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <i className="fa-solid fa-lock mb-4" style={{ fontSize: '64px', color: '#d4af37' }}></i>
        <h2>Admin Access Only</h2>
      </div>
    );
  }

  const handleLogout = () => {
    // Assuming App.jsx handles logout, but just redirect for now
    navigate('/');
  };

  return (
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
            <Link to="/admin/custom-orders" className="active">
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

      {/* MAIN CONTENT */}
      <div className="admin-dark-main">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <div className="admin-dark-breadcrumb">Command / <span className="active-crumb">Custom Orders</span></div>
            <h1 className="admin-dark-title mb-0">Custom Order Reviews</h1>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-12">
            <div className="dark-panel">
              <div className="dark-panel-header">
                <h3 className="dark-panel-title">Pending Custom Order Reviews</h3>
                <span className="badge bg-warning text-dark px-3 py-2 font-weight-bold">{bespokeRequests.filter(r => r.status === 'Pending Approval').length} Awaiting Review</span>
              </div>

              <div className="table-responsive">
                <table className="dark-table">
                  <thead>
                    <tr>
                      <th>Custom Order Details</th>
                      <th>Client</th>
                      <th>Budget & Due Date</th>
                      <th>Curator Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bespokeRequests.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">No custom orders found in the registry.</td>
                      </tr>
                    ) : (
                      bespokeRequests.map(req => (
                        <tr key={req.id}>
                          <td>
                            <div className="dark-product">
                              <div>
                                <div className="dark-product-name">{req.awardTitle}</div>
                                <div className="dark-product-sku mt-1">Theme: {req.awardTheme}</div>
                                {req.status === 'Pending Approval' && <span className="badge bg-warning text-dark mt-2">Pending</span>}
                                {req.status === 'Approved' && <span className="badge bg-success mt-2">Approved</span>}
                                {req.status === 'Cross Question' && <span className="badge bg-info text-dark mt-2">Questions Sent</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-light">{req.clientName}</div>
                            <div className="text-muted-dark small">{req.clientEmail}</div>
                            <div className="text-muted-dark small">{req.clientPhone}</div>
                          </td>
                          <td>
                            <div className="amount-gold">{req.budget}</div>
                            <div className="text-muted-dark small mt-1">Due: {new Date(req.targetDate).toLocaleDateString()}</div>
                          </td>
                          <td>
                            {req.status === 'Pending Approval' ? (
                              <div className="d-flex gap-2">
                                <button className="btn-approve-dark" onClick={() => {
                                  triggerNotification(`Custom Order "${req.awardTitle}" has been APPROVED!`, 'success', 'Bespoke Approved');
                                  onApproveBespoke(req);
                                }}>
                                  Approve
                                </button>
                                <button className="btn-action" onClick={() => {
                                  const question = window.prompt(`Cross-question for ${req.clientName} regarding "${req.awardTitle}":`);
                                  if (question) {
                                    triggerNotification(`Clarification request sent to client regarding: ${req.awardTitle}`, 'info', 'Clarification Dispatched');
                                    onCrossQuestionBespoke(req, question);
                                  }
                                }}>
                                  Clarify
                                </button>
                                <button className="btn-reject-dark" onClick={() => {
                                  triggerNotification(`Custom Order "${req.awardTitle}" has been rejected.`, 'error', 'Bespoke Rejected');
                                  onRejectBespoke(req);
                                }}>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted-dark" style={{ fontStyle: 'italic' }}>Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomOrder;
