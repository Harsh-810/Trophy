import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';

const AdminOrder = ({ currentUser, orders = [], onUpdateOrderStatus }) => {
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

  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusTab, setStatusTab] = useState('All');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      // 1. Time Filter
      let matchesTime = true;
      if (timeFilter !== 'All Time') {
        const d = new Date(order.date);
        if (!isNaN(d)) {
          if (timeFilter === 'Daily') {
            matchesTime = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else if (timeFilter === 'Monthly') {
            matchesTime = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else if (timeFilter === 'Yearly') {
            matchesTime = d.getFullYear() === now.getFullYear();
          }
        }
      }

      // 2. Status Tab Filter
      let matchesStatus = true;
      if (statusTab !== 'All') {
        if (statusTab === 'Return Requests') {
          matchesStatus = order.status && (
            order.status === 'Return Pending' || 
            order.status === 'Returned' || 
            order.status === 'Return Rejected'
          );
        } else {
          matchesStatus = order.status === statusTab;
        }
      }

      return matchesTime && matchesStatus;
    });
  }, [orders, timeFilter, statusTab]);

  const totalProducts = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      const orderItemsCount = order.items ? order.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 0;
      return sum + orderItemsCount;
    }, 0);
  }, [filteredOrders]);

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    triggerNotification(`Order ${orderId} has been successfully updated to status: ${newStatus}`, 'success', 'Order Dispatched');
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
              <Link to="/admin/orders" className="active">
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
            Admin Console &nbsp;/&nbsp; <span className="active-crumb">Orders</span>
          </div>

          <h1 className="admin-dark-title">Client Portfolio Dispatches</h1>

          {/* Status filtering pills */}
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {['All', 'Pending Approval', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requests'].map((tab) => {
              const count = orders.filter(o => {
                if (tab === 'All') return true;
                if (tab === 'Return Requests') return o.status === 'Return Pending' || o.status === 'Returned' || o.status === 'Return Rejected';
                return o.status === tab;
              }).length;
              const isActive = statusTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className="btn btn-sm text-uppercase font-weight-bold px-3 py-2 text-nowrap"
                  style={{
                    background: isActive ? 'linear-gradient(90deg, #d4af37, #f1d255)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#000' : '#aaa',
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* ORDERS TABLE PANEL */}
          <div className="dark-panel">
            <div className="dark-panel-header">
              <div>
                <h3 className="dark-panel-title">Active Order Registry</h3>
                <span className="text-muted small">
                  {filteredOrders.length} {timeFilter !== 'All Time' ? timeFilter : 'Total'} Orders ({totalProducts} Products Dispatched)
                </span>
              </div>
              <div>
                <select 
                  className="form-select-dark" 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="All Time">All Time</option>
                  <option value="Daily">Daily (Today)</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>Order Key / Items</th>
                    <th>Registry Customer</th>
                    <th>Curation Date</th>
                    <th>Investment Value</th>
                    <th>Curation Stage (Status)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No orders found for the selected period.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>
                          <div><strong>Order #{order.orderId}</strong></div>
                          <div className="small text-muted">
                            {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                          </div>
                        </td>
                        <td>
                          <div><strong>{order.customerName}</strong></div>
                          <div className="small text-muted">{order.customerEmail}</div>
                        </td>
                        <td>{order.date}</td>
                        <td className="amount-gold">₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td>
                          <select
                            className="form-select-dark"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          >
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Return Pending">Return Pending</option>
                            <option value="Returned">Returned</option>
                            <option value="Return Rejected">Return Rejected</option>
                          </select>
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

export default AdminOrder;
