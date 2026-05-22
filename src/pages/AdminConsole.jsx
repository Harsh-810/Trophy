import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useNotification } from '../components/UnifiedToast';

const AdminConsole = ({ 
  currentUser, 
  orders = [], 
  bespokeRequests = [], 
  onApproveBespoke, 
  onRejectBespoke, 
  onCrossQuestionBespoke, 
  coupons = [], 
  products = [], 
  users = [], 
  inquiries = [] 
}) => {
  const navigate = useNavigate();
  const { triggerNotification } = useNotification();
  const [adminTab, setAdminTab] = useState('overview');

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

  // Flash Sales & Banner configurations State
  const [flashSaleTime, setFlashSaleTime] = useState('02:45:10');
  const [bannerAlert, setBannerAlert] = useState('Exclusive Curation: VIP Prime membership unlocks priority gold forging queue!');
  
  // Website System configurations State
  const [shippingCharge, setShippingCharge] = useState('250');
  const [taxRate, setTaxRate] = useState('18');
  const [lowStockAlertThreshold, setLowStockAlertThreshold] = useState('5');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Dashboard Stats Calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingRequests = bespokeRequests.filter(r => r.status === 'Pending Approval');
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');

  // 1. Products by Category
  const productCats = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
  const productData = Object.keys(productCats).map(k => ({ name: k, value: productCats[k] }));

  // 2. Orders by Status
  const orderStatuses = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  const orderData = Object.keys(orderStatuses).map(k => ({ name: k, value: orderStatuses[k] }));

  // 3. Custom Orders by Status
  const customStatuses = bespokeRequests.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
  const customOrderData = Object.keys(customStatuses).map(k => ({ name: k, value: customStatuses[k] }));

  // 4. Customer Growth simulated Recharts Data (Monthly Revenue)
  const growthData = [
    { name: 'Jan', Sales: totalSales * 0.1, Customers: 85 },
    { name: 'Feb', Sales: totalSales * 0.25, Customers: 120 },
    { name: 'Mar', Sales: totalSales * 0.45, Customers: 190 },
    { name: 'Apr', Sales: totalSales * 0.7, Customers: 240 },
    { name: 'May', Sales: totalSales, Customers: users.length }
  ];

  const pieColors = ['#d4af37', '#17a2b8', '#28a745', '#dc3545', '#6f42c1', '#fd7e14'];

  const handleSaveBannerConfig = (e) => {
    e.preventDefault();
    triggerNotification('Flash Sales & Marketing Banner configuration updated successfully.', 'success', 'Alert Engine');
  };

  const handleSaveSystemConfigs = (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      triggerNotification('Aurelian Curatorial system constants synchronized.', 'success', 'Settings Synchronized');
    }, 1000);
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
              <Link to="/admin" className="active">
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
                <span className="admin-dark-badge">{activeOrders.length}</span>
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
            <button className="btn-admin-dark w-100 py-2 border border-secondary border-opacity-20 bg-transparent text-white" onClick={() => navigate('/')} style={{ borderRadius: '4px' }}>
              Exit Admin Console
            </button>

            <div className="admin-dark-user mt-3">
              <img src={currentUser.avatar} alt="Curator" />
              <div>
                <div className="admin-dark-user-name">{currentUser.name}</div>
                <div className="admin-dark-user-role">Chief Curator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="admin-dark-main">
          <div className="admin-dark-breadcrumb">
            Admin Console &nbsp;/&nbsp; <span className="active-crumb">Dashboard</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h1 className="admin-dark-title mb-0">Control & Analytics Panel</h1>
            
            {/* Sub-tab navigation */}
            <div className="d-flex gap-2 bg-black p-1 border border-secondary border-opacity-15 rounded-3">
              <button onClick={() => setAdminTab('overview')} className={`btn btn-sm text-uppercase font-weight-bold px-3 py-2 ${adminTab === 'overview' ? 'text-dark fw-bold' : 'text-muted'}`} style={{ background: adminTab === 'overview' ? 'linear-gradient(90deg, #d4af37, #f1d255)' : 'transparent', border: 'none', fontSize: '11px', letterSpacing: '1px' }}>
                Analytics & Charts
              </button>
              <button onClick={() => setAdminTab('profile')} className={`btn btn-sm text-uppercase font-weight-bold px-3 py-2 ${adminTab === 'profile' ? 'text-dark fw-bold' : 'text-muted'}`} style={{ background: adminTab === 'profile' ? 'linear-gradient(90deg, #d4af37, #f1d255)' : 'transparent', border: 'none', fontSize: '11px', letterSpacing: '1px' }}>
                Curator Credentials
              </button>
              <button onClick={() => setAdminTab('banners')} className={`btn btn-sm text-uppercase font-weight-bold px-3 py-2 ${adminTab === 'banners' ? 'text-dark fw-bold' : 'text-muted'}`} style={{ background: adminTab === 'banners' ? 'linear-gradient(90deg, #d4af37, #f1d255)' : 'transparent', border: 'none', fontSize: '11px', letterSpacing: '1px' }}>
                Flash Sales & Banners
              </button>
              <button onClick={() => setAdminTab('settings')} className={`btn btn-sm text-uppercase font-weight-bold px-3 py-2 ${adminTab === 'settings' ? 'text-dark fw-bold' : 'text-muted'}`} style={{ background: adminTab === 'settings' ? 'linear-gradient(90deg, #d4af37, #f1d255)' : 'transparent', border: 'none', fontSize: '11px', letterSpacing: '1px' }}>
                Website Constants
              </button>
            </div>
          </div>

          {/* SUBTAB 1: ANALYTICS & CHARTS */}
          {adminTab === 'overview' && (
            <section>
              {/* STATS ROW */}
              <div className="row g-4 mb-5">
                <div className="col-md-3">
                  <div className="dark-metric-card">
                    <div className="dark-metric-top">
                      <div className="dark-metric-icon">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                      </div>
                      <span className="dark-metric-note text-warning">↗ +14.2%</span>
                    </div>
                    <div className="dark-metric-label">Curator Net Revenue</div>
                    <div className="dark-metric-value">₹{totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div className="dark-metric-sub">Insured sales from all client orders</div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="dark-metric-card">
                    <div className="dark-metric-top">
                      <div className="dark-metric-icon">
                        <i className="fa-solid fa-compass-drafting"></i>
                      </div>
                      <span className="dark-metric-note text-warning">Pending Review</span>
                    </div>
                    <div className="dark-metric-label">Bespoke Concept Orders</div>
                    <div className="dark-metric-value">{pendingRequests.length}</div>
                    <div className="dark-metric-sub">Custom order layouts to verify</div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="dark-metric-card">
                    <div className="dark-metric-top">
                      <div className="dark-metric-icon">
                        <i className="fa-solid fa-truck-ramp-box"></i>
                      </div>
                      <span className="dark-metric-note text-info">In Dispatch</span>
                    </div>
                    <div className="dark-metric-label">Active Transits</div>
                    <div className="dark-metric-value">{activeOrders.length}</div>
                    <div className="dark-metric-sub">Trophies currently in construction</div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="dark-metric-card">
                    <div className="dark-metric-top">
                      <div className="dark-metric-icon">
                        <i className="fa-solid fa-users"></i>
                      </div>
                      <span className="dark-metric-note text-success">Audited Registry</span>
                    </div>
                    <div className="dark-metric-label">Registered Members</div>
                    <div className="dark-metric-value">{users.length}</div>
                    <div className="dark-metric-sub">Qualified clients in database</div>
                  </div>
                </div>
              </div>

              {/* RECHARTS VISUALS */}
              <div className="row g-4 mb-4">
                {/* 1. Monthly Revenue & Growth (Area Chart) */}
                <div className="col-lg-8">
                  <div className="dark-panel h-100">
                    <div className="dark-panel-header">
                      <h3 className="dark-panel-title">Revenue & Customer Expansion Analytics</h3>
                    </div>
                    <div style={{ width: '100%', height: '280px', padding: '10px 10px 0 0', cursor: 'default' }}>
                      <ResponsiveContainer>
                        <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                          <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#121213', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                          <Area type="monotone" dataKey="Sales" stroke="#d4af37" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 2. Orders by Status (Pie Chart) */}
                <div className="col-lg-4">
                  <div className="dark-panel h-100">
                    <div className="dark-panel-header">
                      <h3 className="dark-panel-title">Order Status Ledger</h3>
                    </div>
                    <div style={{ width: '100%', height: '280px', padding: '10px', cursor: 'default' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={orderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                            {orderData.map((e, i) => <Cell key={`c-${i}`} fill={pieColors[i % pieColors.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#121213', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                          <Legend wrapperStyle={{ color: '#aaa', fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 3. Products by Category */}
                <div className="col-md-6">
                  <div className="dark-panel h-100">
                    <div className="dark-panel-header">
                      <h3 className="dark-panel-title">Collections Categorization</h3>
                    </div>
                    <div style={{ width: '100%', height: '250px', padding: '10px 10px 0 0' }}>
                      <ResponsiveContainer>
                        <BarChart data={productData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                          <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#121213', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                          <Bar dataKey="value" fill="#d4af37" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 4. Custom Orders reviews */}
                <div className="col-md-6">
                  <div className="dark-panel h-100">
                    <div className="dark-panel-header">
                      <h3 className="dark-panel-title">Bespoke Curation Pipeline</h3>
                    </div>
                    <div style={{ width: '100%', height: '250px', padding: '10px' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={customOrderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                            {customOrderData.map((e, i) => <Cell key={`c-${i}`} fill={pieColors[(i+2) % pieColors.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#121213', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                          <Legend wrapperStyle={{ color: '#aaa', fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SUBTAB 2: CURATOR CREDENTIALS */}
          {adminTab === 'profile' && (
            <section className="dark-panel p-4">
              <div className="dark-panel-header mb-4">
                <h3 className="dark-panel-title"><i className="fa-solid fa-address-card text-warning me-2"></i> Master Curator Clearance Details</h3>
              </div>

              <div className="row g-4 align-items-center">
                <div className="col-md-3 text-center border-end border-secondary border-opacity-15">
                  <img 
                    src={currentUser.avatar} 
                    alt="Curator" 
                    className="img-fluid rounded-circle mb-3" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #d4af37' }}
                  />
                  <h4 className="text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{currentUser.name}</h4>
                  <span className="badge bg-warning text-dark font-weight-bold px-3 py-1">MASTER CURATOR</span>
                </div>

                <div className="col-md-9 ps-md-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <span className="text-muted d-block small uppercase" style={{ fontSize: '10px' }}>Primary Registry Email</span>
                      <strong className="text-white">{currentUser.email}</strong>
                    </div>
                    <div className="col-md-6">
                      <span className="text-muted d-block small uppercase" style={{ fontSize: '10px' }}>Clearance Role Tier</span>
                      <strong className="text-warning">Chief Curator Executive</strong>
                    </div>
                    <div className="col-md-6">
                      <span className="text-muted d-block small uppercase" style={{ fontSize: '10px' }}>Permissions Clearance</span>
                      <div className="d-flex gap-2 flex-wrap mt-1">
                        <span className="badge bg-dark border border-secondary text-white-50">Curation Forge</span>
                        <span className="badge bg-dark border border-secondary text-white-50">Financial Ledger</span>
                        <span className="badge bg-dark border border-secondary text-white-50">Identity Audit</span>
                        <span className="badge bg-dark border border-secondary text-white-50">Staff Admin</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <span className="text-muted d-block small uppercase" style={{ fontSize: '10px' }}>Last Authentication Timestamp</span>
                      <strong className="text-light">May 22, 2026 at 12:45 PM IST</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SUBTAB 3: FLASH SALES & BANNERS */}
          {adminTab === 'banners' && (
            <section className="dark-panel p-4">
              <div className="dark-panel-header mb-4">
                <h3 className="dark-panel-title"><i className="fa-solid fa-bullhorn text-warning me-2"></i> Banner Alert & Flash Sales Engine</h3>
              </div>

              <form onSubmit={handleSaveBannerConfig}>
                <div className="mb-4">
                  <label className="form-label text-warning small uppercase tracking-wider">Site-wide Promotional Banner Banner Message</label>
                  <textarea 
                    className="form-control form-select-dark bg-black border border-secondary border-opacity-20 text-white w-100 p-3" 
                    rows="3" 
                    value={bannerAlert} 
                    onChange={(e) => setBannerAlert(e.target.value)}
                  ></textarea>
                  <small className="text-muted">Displays dynamically at the top of the header in client panels.</small>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-warning small uppercase tracking-wider">Active Flash Sales Timer (HH:MM:SS)</label>
                    <input 
                      type="text" 
                      className="form-control form-select-dark bg-black border border-secondary border-opacity-20 text-white w-100 p-3" 
                      value={flashSaleTime} 
                      onChange={(e) => setFlashSaleTime(e.target.value)} 
                    />
                    <small className="text-muted">Countdown clock binding for custom flash campaigns.</small>
                  </div>
                </div>

                <button type="submit" className="btn text-dark font-weight-bold px-4 py-3" style={{ background: 'linear-gradient(90deg, #d4af37, #f1d255)', border: 'none', fontWeight: 'bold' }}>
                  Synchronize Promotional Engines
                </button>
              </form>
            </section>
          )}

          {/* SUBTAB 4: SYSTEM SETTINGS */}
          {adminTab === 'settings' && (
            <section className="dark-panel p-4">
              <div className="dark-panel-header mb-4">
                <h3 className="dark-panel-title"><i className="fa-solid fa-sliders text-warning me-2"></i> Website Constant Parameters</h3>
              </div>

              <form onSubmit={handleSaveSystemConfigs}>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-warning small uppercase">Global Curation Handling Charges (INR)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-black border-secondary border-opacity-20 text-warning">₹</span>
                      <input 
                        type="number" 
                        className="form-control form-select-dark bg-black border border-secondary border-opacity-20 text-white p-3" 
                        value={shippingCharge} 
                        onChange={(e) => setShippingCharge(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small uppercase">GST Tax Curation Rate (%)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control form-select-dark bg-black border border-secondary border-opacity-20 text-white p-3" 
                        value={taxRate} 
                        onChange={(e) => setTaxRate(e.target.value)} 
                      />
                      <span className="input-group-text bg-black border-secondary border-opacity-20 text-warning">%</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small uppercase">Low Stock Trigger Limit</label>
                    <input 
                      type="number" 
                      className="form-control form-select-dark bg-black border border-secondary border-opacity-20 text-white p-3" 
                      value={lowStockAlertThreshold} 
                      onChange={(e) => setLowStockAlertThreshold(e.target.value)} 
                    />
                    <small className="text-muted">Highlights products in curation forge listings when stock falls below this quantity.</small>
                  </div>
                </div>

                <button type="submit" className="btn text-dark font-weight-bold px-4 py-3" style={{ background: 'linear-gradient(90deg, #d4af37, #f1d255)', border: 'none', fontWeight: 'bold' }} disabled={isSavingSettings}>
                  {isSavingSettings ? 'Synchronizing Systems...' : 'Commit Website Settings'}
                </button>
              </form>
            </section>
          )}

        </main>
      </div>
    </>
  );
};

export default AdminConsole;
