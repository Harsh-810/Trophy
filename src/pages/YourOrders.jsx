import React, { useState, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const YourOrders = ({ currentUser, orders = [] }) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders by search
  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm]);

  // Protect route
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

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

        .artifact img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
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
        .status-vault { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); }

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
              <h1 className="page-title">Your Orders</h1>
            </div>
            <Link to="/profile" className="btn-action d-flex align-items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Back to Profile
            </Link>
          </div>
          
          <div className="title-divider"></div>

          <section className="table-panel">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <h2 className="panel-title">Your Product Orders</h2>

              <div className="d-flex gap-2">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search orders..."
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
                    <th>Purchased Item</th>
                    <th>Order Status</th>
                    <th>Order Date</th>
                    <th>Total Spent</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                          <i className="fa-solid fa-box-open d-block mb-4" style={{ fontSize: '48px', color: '#d8b84b' }}></i>
                          <h4 style={{ color: '#fff', marginBottom: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '28px' }}>You haven't made any orders yet.</h4>
                          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', fontSize: '15px' }}>Explore our masterpiece collection to begin your journey of excellence.</p>
                          <button className="btn btn-gold px-4 py-2 text-uppercase" style={{ letterSpacing: '1px', borderRadius: '4px' }} onClick={() => navigate('/catalog')}>Purchase Order</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredOrders.map((order) => (
                        <tr key={order.orderId}>
                          <td>
                            <div className="artifact">
                              <img src={order.items[0]?.image || 'https://images.unsplash.com/photo-1616628182509-6f36dff7b20e?auto=format&fit=crop&w=200&q=80'} alt="" />
                              <div>
                                <div className="artifact-title">Order {order.orderId}</div>
                                <div className="artifact-sub">
                                  {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${order.status === 'Pending Approval' ? 'status-pending' : order.status === 'Shipped' ? 'status-vault' : 'status-approved'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.date}</td>
                          <td className="amount">₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="text-end">
                            <button className="btn-action" onClick={() => triggerNotification('Detailed receipt will be sent to your registered email.', 'info', 'Receipt Requested')}>View Details</button>
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

export default YourOrders;
