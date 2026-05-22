import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminInquiry = ({ currentUser, inquiries = [] }) => {
  const navigate = useNavigate();
  const [subjectFilter, setSubjectFilter] = useState('All');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-5" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <i className="fa-solid fa-lock mb-4" style={{ fontSize: '64px', color: '#d4af37' }}></i>
        <h2>Admin Access Only</h2>
      </div>
    );
  }

  const handleLogout = () => {
    navigate('/');
  };

  // Derived subjects for the filter
  const subjects = ['All', ...Array.from(new Set(inquiries.map(i => i.subject))).filter(Boolean)];

  // Filtered inquiries
  const filteredInquiries = subjectFilter === 'All' 
    ? inquiries 
    : inquiries.filter(i => i.subject === subjectFilter);

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
            <Link to="/admin/custom-orders">
              <i className="fa-solid fa-compass-drafting"></i> Custom Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/inquiries" className="active">
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
            <div className="admin-dark-breadcrumb">Command / <span className="active-crumb">Inquiries</span></div>
            <h1 className="admin-dark-title mb-0">Client Inquiries</h1>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-12">
            <div className="dark-panel">
              <div className="dark-panel-header">
                <h3 className="dark-panel-title">Inquiry Logs</h3>
                
                <div style={{ width: '250px' }}>
                  <select 
                    className="form-select-dark" 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  >
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="dark-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client Details</th>
                      <th>Subject</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">No inquiries found.</td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq, index) => (
                        <tr key={inq.id || index}>
                          <td style={{ verticalAlign: 'top', paddingTop: '25px' }}>
                            <div className="text-muted-dark small">{new Date(inq.date).toLocaleDateString()}</div>
                            <div className="text-muted-dark small">{new Date(inq.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td style={{ verticalAlign: 'top', paddingTop: '25px' }}>
                            <div className="text-light font-weight-bold">{inq.name}</div>
                            <div className="text-muted-dark small">{inq.email}</div>
                          </td>
                          <td style={{ verticalAlign: 'top', paddingTop: '25px' }}>
                            <span className="dark-badge-role">{inq.subject}</span>
                          </td>
                          <td style={{ verticalAlign: 'top', paddingTop: '25px', maxWidth: '400px' }}>
                            <div className="text-light" style={{ lineHeight: '1.6', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                              {inq.message}
                            </div>
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

export default AdminInquiry;
