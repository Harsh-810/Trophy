import React, { useState, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';
import Swal from 'sweetalert2';

const BespokeRequests = ({ currentUser, bespokeRequests = [], onUpdateBespokeRequest, onDeleteBespokeRequest }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // For replying to Cross Question
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Filter logic
  const filteredRequests = useMemo(() => {
    return bespokeRequests.filter(req => {
      // Search
      const matchesSearch = req.awardTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            req.recipient?.toLowerCase().includes(searchTerm.toLowerCase());
                            
      // Status filter
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Cancelled') {
          matchesStatus = req.status === 'Archived';
        } else {
          matchesStatus = req.status === statusFilter;
        }
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [bespokeRequests, searchTerm, statusFilter]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleReplySubmit = (req) => {
    if (!replyText.trim()) {
      triggerNotification('Please enter a response.', 'error', 'Validation Error');
      return;
    }
    const updatedNotes = req.notes ? `${req.notes}\n\n[User Reply]: ${replyText}` : `[User Reply]: ${replyText}`;
    onUpdateBespokeRequest({ ...req, notes: updatedNotes, status: 'Pending Approval', adminNotes: '' });
    setReplyingToId(null);
    setReplyText('');
    triggerNotification('Your reply has been sent to the Admin.', 'success', 'Reply Sent');
  };

  return (
    <>
      <style>{`
        /* Same portal styles from MyProfile.jsx */
        #hrrerr {
            font-family: 'Inter', sans-serif;
            background: #050508;
            color: #f5f2ec;
            min-height: 100vh;
        }

        #hrrerr a { text-decoration: none; transition: all 0.3s ease; }

        .portal-topbar {
            background: rgba(10, 10, 14, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(216, 184, 75, 0.15);
            padding: 18px 40px;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .portal-topbar .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 38px;
            font-weight: 700;
            background: linear-gradient(90deg, #d8b84b, #f0d05c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .portal-topbar .nav-link {
            color: rgba(255, 255, 255, 0.6);
            font-size: 15px;
            font-weight: 500;
            padding: 0 20px !important;
            letter-spacing: 1px;
            text-transform: uppercase;
            position: relative;
        }

        .portal-topbar .nav-link:hover,
        .portal-topbar .nav-link.active {
            color: #d8b84b;
        }

        .portal-topbar .icon-btn {
            color: #fff;
            font-size: 20px;
            margin-left: 20px;
            text-decoration: none;
        }

        .page-kicker {
            color: #d8b84b;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .page-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 64px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #fff;
        }

        .title-divider {
            height: 1px;
            background: linear-gradient(90deg, rgba(216, 184, 75, 0.5), transparent);
            margin: 40px 0;
            width: 100%;
        }

        .table-panel {
            background: #0e0e0e;
            border: 1px solid rgba(228, 194, 75, 0.15);
            border-radius: 4px;
            padding: 40px;
        }

        .panel-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 38px;
            color: #fff;
            margin-bottom: 0;
        }

        .filter-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.5);
            padding: 8px 16px;
            font-size: 13px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-btn.active, .filter-btn:hover {
            border-color: #d8b84b;
            color: #d8b84b;
            background: rgba(216, 184, 75, 0.05);
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 10px 40px 10px 16px;
            border-radius: 4px;
            outline: none;
            width: 250px;
        }

        .search-box input:focus {
            border-color: #d8b84b;
        }

        .search-box i {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.3);
        }

        .transactions-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
        }

        .transactions-table th {
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 0 20px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .transactions-table td {
            background: rgba(255, 255, 255, 0.02);
            padding: 24px 20px;
            vertical-align: middle;
        }

        .transactions-table tr td:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .transactions-table tr td:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }

        .artifact {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .artifact-title {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .artifact-sub {
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
        }

        .amount {
            color: #d8b84b;
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            font-weight: 700;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .status-pending { background: rgba(228, 194, 75, 0.1); color: #d8b84b; border: 1px solid rgba(228, 194, 75, 0.2); }
        .status-approved { background: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid rgba(40, 167, 69, 0.2); }
        .status-archived { background: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid rgba(220, 53, 69, 0.2); }
        .status-cross { background: rgba(23, 162, 184, 0.1); color: #17a2b8; border: 1px solid rgba(23, 162, 184, 0.2); }

        .btn-action {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 8px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-action:hover {
            border-color: #d8b84b;
            color: #d8b84b;
        }
        
        .btn-gold {
            background: linear-gradient(90deg,#e4c24b,#f0d05c);
            border: none;
            color: #111;
            font-weight: bold;
        }
        .btn-gold:hover {
            opacity: 0.9;
        }
        
        .admin-note-box {
            background: rgba(23, 162, 184, 0.05);
            border-left: 3px solid #17a2b8;
            padding: 12px;
            margin-top: 15px;
            border-radius: 0 4px 4px 0;
            font-size: 13px;
        }
      `}</style>

      <div id="hrrerr">
        <header className="portal-topbar">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <Link to="/" className="brand">Aurelian</Link>

              <nav className="d-none d-lg-flex align-items-center">
                <Link className="nav-link" to="/catalog">Catalog</Link>
                <Link className="nav-link" to="/custom-order">Custom Orders</Link>
                <Link className="nav-link" to="/about">About Heritage</Link>
                <Link className="nav-link" to="/profile">My Profile</Link>
              </nav>

              <div className="d-flex align-items-center">
                <Link to="/cart" className="icon-btn"><i className="fa-solid fa-cart-shopping"></i></Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container-fluid py-5 px-4 px-lg-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="page-kicker">Your Profile</div>
              <h1 className="page-title">Custom Orders</h1>
            </div>
            <Link to="/profile" className="btn-action d-flex align-items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Back to Profile
            </Link>
          </div>
          
          <div className="title-divider"></div>

          <section className="table-panel">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div className="d-flex gap-2">
                {['All', 'Approved', 'Pending Approval', 'Cross Question', 'Cancelled'].map(f => (
                  <button 
                    key={f}
                    className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
                    onClick={() => setStatusFilter(f)}
                  >
                    {f === 'Pending Approval' ? 'Pending' : f}
                  </button>
                ))}
              </div>

              <div className="d-flex gap-2">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Custom Order Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Investment Value</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                          <i className="fa-solid fa-compass-drafting d-block mb-4" style={{ fontSize: '48px', color: '#d8b84b' }}></i>
                          <h4 style={{ color: '#fff', marginBottom: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '28px' }}>No custom orders found.</h4>
                          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', fontSize: '15px' }}>Commission a unique masterpiece crafted to your exact specifications.</p>
                          <button className="btn btn-gold px-4 py-2 text-uppercase" style={{ letterSpacing: '1px', borderRadius: '4px' }} onClick={() => navigate('/custom-order')}>Commission Concept</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredRequests.map((request, index) => (
                        <tr key={`bespoke-${request.id || index}`}>
                          <td>
                            <div className="artifact">
                              <div>
                                <div className="artifact-title">{request.awardTitle}</div>
                                <div className="artifact-sub">Material: {request.material} | Recipient: {request.recipient}</div>
                                
                                {request.status === 'Cross Question' && request.adminNotes && (
                                  <div className="admin-note-box">
                                    <strong style={{color: '#17a2b8'}}>Admin Inquiry:</strong><br/>
                                    {request.adminNotes}
                                  </div>
                                )}
                                
                                {replyingToId === request.id && (
                                  <div className="mt-3">
                                    <textarea 
                                      className="form-control mb-2" 
                                      rows="3"
                                      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #17a2b8', color: '#fff', fontSize: '13px' }}
                                      value={replyText} 
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Provide your clarification..."
                                    ></textarea>
                                    <button className="btn-action" style={{borderColor: '#17a2b8', color: '#17a2b8'}} onClick={() => handleReplySubmit(request)}>Send Reply</button>
                                    <button className="btn-action ms-2" onClick={() => setReplyingToId(null)}>Cancel</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${
                              request.status === 'Approved' ? 'status-approved' : 
                              request.status === 'Archived' ? 'status-archived' :
                              request.status === 'Cross Question' ? 'status-cross' : 'status-pending'
                            }`}>
                              {request.status || 'Pending Approval'}
                            </span>
                          </td>
                          <td>{request.date || 'Pending'}</td>
                          <td className="amount">TBD</td>
                          <td className="text-end">
                            {request.status === 'Cross Question' ? (
                                <button className="btn-action" style={{borderColor: '#17a2b8', color: '#17a2b8'}} onClick={() => {
                                    setReplyingToId(request.id);
                                    setReplyText('');
                                }}>Reply</button>
                            ) : request.status === 'Pending Approval' ? (
                                 <button className="btn-action" onClick={() => {
                                   Swal.fire({
                                     title: 'Recall Custom Order?',
                                     text: 'Are you sure you want to recall and permanently archive this custom order?',
                                     icon: 'warning',
                                     iconColor: '#d4af37',
                                     showCancelButton: true,
                                     confirmButtonText: 'Recall & Archive',
                                     cancelButtonText: 'Keep Active',
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
                                       onDeleteBespokeRequest(request.id);
                                       triggerNotification('Custom order request recalled and archived successfully.', 'info', 'Order Recalled');
                                     }
                                   });
                                 }}>Recall</button>
                            ) : (
                                <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default BespokeRequests;
