import React, { useState, useEffect } from 'react';
import './index.css';
import './admin.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

const GlobalRouteListener = () => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    
    if (location.pathname.startsWith('/admin')) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [location.pathname]);
  return null;
};

// Import All 17 Converted Modular Luxury Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import ShoppingBag from './pages/ShoppingBag';
import SecureCheckout from './pages/SecureCheckout';
import LoginOnyx from './pages/LoginOnyx';
import PasswordRecovery from './pages/PasswordRecovery';
import Registration from './pages/Registration';
import MyProfile from './pages/MyProfile';
import YourOrders from './pages/YourOrders';
import BespokeRequests from './pages/BespokeRequests';
import ClientSubmission from './pages/ClientSubmission';
import AboutHeritage from './pages/AboutHeritage';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import AdminConsole from './pages/AdminConsole';
import AdminProduct from './pages/AdminProduct';
import AdminOrder from './pages/AdminOrder';
import AdminCoupon from './pages/AdminCoupon';
import AdminUser from './pages/AdminUser';
import AdminInquiry from './pages/AdminInquiry';
import AdminCustomOrder from './pages/AdminCustomOrder';
import Notifications from './pages/Notifications';
import { NotificationProvider } from './components/UnifiedToast';

const App = () => {
  // 1. Shared Authentication state
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Shared Master Registry Users
  const [users, setUsers] = useState([]);

  // 3. Shared Master Masterpieces catalog
  const [products, setProducts] = useState([]);

  // 4. Cart items State
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bespokeRequests, setBespokeRequests] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newCouponNotification, setNewCouponNotification] = useState(false);

  // Onyx Navigator states
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('dark-mode');
  }, []);

  // Load persistent user session and master database lists from JSON Server on mount
  useEffect(() => {
    // 1. Session persistence
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed parsing persistent session", e);
      }
    }

    // 2. Fetch master lists from json-server with local defaults fallback
    const syncDatabase = async () => {
      try {
        const prodRes = await fetch('http://localhost:3001/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data);
        }
      } catch (err) {
        console.warn("Failed fetching products from db.json. Local seed active.", err);
      }

      try {
        const orderRes = await fetch('http://localhost:3001/orders');
        if (orderRes.ok) {
          const data = await orderRes.json();
          setOrders(data);
        }
      } catch (err) {
        console.warn("Failed fetching orders from db.json. Local seed active.", err);
      }

      try {
        const bespokeRes = await fetch('http://localhost:3001/bespokeRequests');
        if (bespokeRes.ok) {
          const data = await bespokeRes.json();
          setBespokeRequests(data);
        }
      } catch (err) {
        console.warn("Failed fetching bespoke requests from db.json. Local seed active.", err);
      }

      try {
        const couponRes = await fetch('http://localhost:3001/coupons');
        if (couponRes.ok) {
          const data = await couponRes.json();
          setCoupons(data);
        }
      } catch (err) {
        console.warn("Failed fetching coupons from db.json. Local seed active.", err);
      }

      try {
        const inqRes = await fetch('http://localhost:3001/inquiries');
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          setInquiries(inqData);
        }

        const userRes = await fetch('http://localhost:3001/users');
        if (userRes.ok) {
          const data = await userRes.json();
          setUsers(data);
        }

        const notifRes = await fetch('http://localhost:3001/notifications');
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData);
        }
      } catch (err) {
        console.warn("Failed fetching data from db.json. Local seed active.", err);
      }
    };

    syncDatabase();
  }, []);

  // Cart operations
  const handleAddToCart = (product, quantity = 1, engraving = '', scaleSelection = '') => {
    // Defensive check: if quantity is not a valid number or was omitted/passed as click event, fallback to 1
    const qty = typeof quantity === 'number' ? quantity : 1;

    // Support single parameter with nested options (ProductDetail.jsx output formatting)
    const finalProduct = { ...product };
    const finalScale = scaleSelection || product.selectedScale || product.scaleSelection || product.scale || '12" Standard';
    const finalEngraving = engraving || product.engravingText || product.engraving || 'None';

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === finalProduct.id && item.scaleSelection === finalScale);
      if (existing) {
        return prevCart.map((item) =>
          item.id === finalProduct.id && item.scaleSelection === finalScale
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prevCart,
        {
          ...finalProduct,
          quantity: qty,
          engraving: finalEngraving,
          scaleSelection: finalScale
        }
      ];
    });
  };

  const handleUpdateCartQuantity = (id, scaleSelection, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && item.scaleSelection === scaleSelection
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
    );
  };

  const handleRemoveFromCart = (id, scaleSelection) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.scaleSelection === scaleSelection)));
  };

  const handleClearCart = () => setCart([]);

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Add user to master list if they don't exist
    setUsers((prev) => {
      if (prev.some((u) => u.email === user.email)) return prev;
      return [...prev, user];
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
  };

  // Bespoke Actions
  const handleSubmitBespokeRequest = async (requestData) => {
    try {
      const res = await fetch('http://localhost:3001/bespokeRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (res.ok) {
        const addedReq = await res.json();
        setBespokeRequests((prev) => [addedReq, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setBespokeRequests((prev) => [requestData, ...prev]);
    }
  };

  const handleApproveBespoke = async (request) => {
    try {
      await fetch(`http://localhost:3001/bespokeRequests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Approved' } : r)));
    } catch (err) {
      console.error(err);
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Approved' } : r)));
    }
  };

  const handleRejectBespoke = async (request) => {
    try {
      await fetch(`http://localhost:3001/bespokeRequests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Archived' })
      });
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Archived' } : r)));
    } catch (err) {
      console.error(err);
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Archived' } : r)));
    }
  };

  const handleCrossQuestionBespoke = async (request, adminNotes) => {
    try {
      await fetch(`http://localhost:3001/bespokeRequests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cross Question', adminNotes })
      });
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Cross Question', adminNotes } : r)));
    } catch (err) {
      console.error(err);
      setBespokeRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: 'Cross Question', adminNotes } : r)));
    }
  };

  const handleUpdateBespokeRequest = async (updatedRequest) => {
    try {
      const res = await fetch(`http://localhost:3001/bespokeRequests/${updatedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRequest)
      });
      if (res.ok) {
        setBespokeRequests((prev) => prev.map((r) => r.id === updatedRequest.id ? { ...r, ...updatedRequest } : r));
      }
    } catch (err) {
      console.error("Failed to update bespoke request in database:", err);
      setBespokeRequests((prev) => prev.map((r) => r.id === updatedRequest.id ? { ...r, ...updatedRequest } : r));
    }
  };

  const handleDeleteBespokeRequest = async (requestId) => {
    try {
      await fetch(`http://localhost:3001/bespokeRequests/${requestId}`, {
        method: 'DELETE'
      });
      setBespokeRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to delete bespoke request from database:", err);
      setBespokeRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };


  // Checkout Finalizer
  const handlePlaceOrder = async (newOrder) => {
    try {
      const res = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const addedOrder = await res.json();
        setOrders((prev) => [addedOrder, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setOrders((prev) => [newOrder, ...prev]);
    }
    handleClearCart();
  };

  // Product CRUD
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const addedProduct = await res.json();
        setProducts((prev) => [...prev, addedProduct]);
      }
    } catch (err) {
      console.error("Failed to add product to database:", err);
      // Fallback
      setProducts((prev) => [...prev, newProduct]);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`http://localhost:3001/products/${updatedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
      }
    } catch (err) {
      console.error("Failed to update product in database:", err);
      setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'DELETE'
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete product from database:", err);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Order CRUD
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (!targetOrder) return;
    try {
      await fetch(`http://localhost:3001/orders/${targetOrder.id || targetOrder.orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  // Inquiry CRUD
  const handleAddInquiry = async (inquiryData) => {
    try {
      const res = await fetch('http://localhost:3001/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiryData, id: Date.now().toString(), status: 'Pending', date: new Date().toISOString() })
      });
      if (res.ok) {
        const added = await res.json();
        setInquiries(prev => [added, ...prev]);
      }
    } catch (e) {
      console.error('Failed to add inquiry', e);
    }
  };

  // Coupon CRUD
  const handleAddCoupon = async (newCoupon) => {
    try {
      const res = await fetch('http://localhost:3001/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        const addedC = await res.json();
        setCoupons((prev) => [...prev, addedC]);
        setNewCouponNotification(true);
        
        // Also fire a global notification
        const newNotif = {
          id: Date.now().toString(),
          title: `Exclusive Offer: ${newCoupon.discount}% OFF`,
          message: `Use code ${newCoupon.code} at checkout to claim your discount.`,
          date: new Date().toISOString(),
          type: "coupon"
        };
        const notifRes = await fetch('http://localhost:3001/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNotif)
        });
        if (notifRes.ok) {
          const addedNotif = await notifRes.json();
          setNotifications(prev => [...prev, addedNotif]);
        }
      }
    } catch (err) {
      console.error(err);
      setCoupons((prev) => [...prev, newCoupon]);
      setNewCouponNotification(true);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await fetch(`http://localhost:3001/coupons/${couponId}`, { method: 'DELETE' });
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (err) {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    }
  };

  // User CRUD
  const handleUpdateUserRole = async (email, newRole) => {
    const targetUser = users.find(u => u.email === email);
    if (!targetUser) return;
    try {
      await fetch(`http://localhost:3001/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)));
      if (currentUser && currentUser.email === email) {
        setCurrentUser((prev) => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)));
      if (currentUser && currentUser.email === email) {
        setCurrentUser((prev) => ({ ...prev, role: newRole }));
      }
    }
  };

  const handleToggleUserBlock = async (email) => {
    const targetUser = users.find(u => u.email === email);
    if (!targetUser) return;
    const nextBlocked = !targetUser.blocked;
    try {
      await fetch(`http://localhost:3001/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked: nextBlocked })
      });
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, blocked: nextBlocked } : u)));
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, blocked: nextBlocked } : u)));
    }
  };

  // Mark Notifications as Read
  const handleMarkAsRead = async (notificationIds) => {
    if (!currentUser) return;
    try {
      const updatedRead = [...new Set([...(currentUser.readNotifications || []), ...notificationIds])];
      const res = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readNotifications: updatedRead })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
    } catch (e) {
      console.error("Failed to mark notifications as read", e);
      const updatedRead = [...new Set([...(currentUser.readNotifications || []), ...notificationIds])];
      const updatedUser = { ...currentUser, readNotifications: updatedRead };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const unreadCount = currentUser ? notifications.filter(n => !(currentUser.readNotifications || []).includes(n.id)).length : 0;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <NotificationProvider>
      <Router>
      <GlobalRouteListener />
      {/* ================= GLOBAL TOP NAVBAR ================= */}
      <style>{`
        .aurelian-header {
            background: transparent;
            border-bottom: none;
            padding: 16px 0;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9999;
            transition: all 0.3s ease;
        }
        
        body.light-mode .aurelian-header {
            background: transparent;
            border-bottom: none;
        }
        
        body.admin-mode .aurelian-header {
            display: none !important;
        }

        .aurelian-logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            line-height: 1;
            font-weight: 700;
            color: #d4af37;
            display: inline-block;
            text-decoration: none !important;
            letter-spacing: 1px;
        }

        .aurelian-nav .nav-link {
            color: rgba(255,255,255,0.9);
            font-size: 13px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0 12px;
            padding: 8px 0;
            position: relative;
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }
        
        body.light-mode .aurelian-nav .nav-link {
            color: #111;
        }

        .aurelian-nav .nav-link:hover {
            color: #d4af37;
        }

        .search-box {
            position: relative;
            flex-grow: 1;
            max-width: 300px;
            margin: 0 24px;
        }

        .search-box input {
            width: 100%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            font-size: 14px;
            padding: 10px 16px 10px 40px;
            border-radius: 4px;
            transition: all 0.3s;
        }
        
        .search-box input:focus {
            background: rgba(255,255,255,0.12);
            border-color: #d4af37;
            outline: none;
        }
        
        body.light-mode .search-box input {
            background: #fff;
            border: 1px solid rgba(179, 139, 27, 0.3);
            color: #111;
        }
        
        body.light-mode .search-box input:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .search-box i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.5);
            font-size: 14px;
        }
        
        body.light-mode .search-box i {
            color: #888;
        }

        .header-icons a, .header-icons button {
            color: #d4af37;
            margin-left: 24px;
            font-size: 23px;
            text-decoration: none;
            background: none;
            border: none;
            transition: transform 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .header-icons a:hover, .header-icons button:hover {
            transform: scale(1.1);
        }

        .header-icons .cart-text {
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            margin-left: 8px;
            text-transform: uppercase;
        }
        
        body.light-mode .header-icons .cart-text {
            color: #111;
        }
        
        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .mobile-menu-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }
        
        .mobile-menu-overlay .close-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            font-size: 28px;
            color: #d4af37;
            background: none;
            border: none;
            cursor: pointer;
        }
        
        .mobile-menu-overlay a {
            color: #fff;
            font-size: 24px;
            font-family: 'Cormorant Garamond', serif;
            margin: 16px 0;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
      `}</style>
      <div className="aurelian-header">
        <div className="container-fluid px-4 px-lg-5">
          <div className="d-flex align-items-center justify-content-between">
            
            {/* LEFT: Logo & Mobile Toggle */}
            <div className="d-flex align-items-center">
              <button 
                className="d-lg-none p-0 me-3 bg-transparent border-0" 
                onClick={() => setIsNavigatorOpen(true)}
                style={{ color: '#d4af37', fontSize: '24px' }}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              <Link to="/" className="aurelian-logo">Aurelian</Link>
            </div>

            {/* CENTER: Navigation Links */}
            <nav className="navbar navbar-expand-lg p-0 d-none d-lg-block">
              <ul className="navbar-nav aurelian-nav d-flex flex-row">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/catalog">Collection</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/custom-order">Client Submission</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
                {currentUser?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning" style={{ fontWeight: '700' }} to="/admin">Admin Dashboard</Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* RIGHT: Search Bar & Icons */}
            <div className="d-flex align-items-center">
              <div className="search-box d-none d-md-block">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search..." />
              </div>

              <div className="header-icons d-flex align-items-center">
                {currentUser ? (
                  <>
                    {/* 1. Notification */}
                    <Link to="/notifications" title="Notifications" className="position-relative">
                      <i className="fa-solid fa-bell"></i>
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '9px', padding: '3px 6px', transform: 'translate(40%, -40%)'}}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>

                    {/* 2. Cart */}
                    <Link to="/cart" className="position-relative" title="Shopping Bag">
                      <i className="fa-solid fa-cart-shopping"></i>
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '9px', padding: '3px 6px', transform: 'translate(40%, -40%)'}}>
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>

                    {/* 3. Profile */}
                    <Link to="/profile" title="My Profile">
                      <i className="fa-regular fa-user"></i>
                    </Link>

                    {/* 4. Logout */}
                    <button onClick={handleLogout} className="p-0 border-0 bg-transparent" title="Log Out" style={{cursor: 'pointer'}}>
                      <i className="fa-solid fa-arrow-right-from-bracket" style={{color: '#ff4d4d'}}></i>
                    </button>
                  </>
                ) : (
                  <>
                    {/* 1. Cart (when logged out) */}
                    <Link to="/cart" className="position-relative" title="Shopping Bag">
                      <i className="fa-solid fa-cart-shopping"></i>
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '9px', padding: '3px 6px', transform: 'translate(40%, -40%)'}}>
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>

                    {/* 2. Profile/Login (when logged out) */}
                    <Link to="/login" title="Login">
                      <i className="fa-regular fa-user"></i>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isNavigatorOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsNavigatorOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <Link to="/" onClick={() => setIsNavigatorOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsNavigatorOpen(false)}>About</Link>
        <Link to="/catalog" onClick={() => setIsNavigatorOpen(false)}>Collection</Link>
        <Link to="/contact" onClick={() => setIsNavigatorOpen(false)}>Contact</Link>
      </div>

      <Routes>
        {/* Client Routes */}
        <Route path="/" element={
          <Home
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            featuredProducts={products}
            onAddToCart={handleAddToCart}
          />
        } />
        <Route path="/catalog" element={
          <Catalog
            allProducts={products}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            onAddToCart={handleAddToCart}
          />
        } />
        <Route path="/product/:id" element={
          <ProductDetail
            allProducts={products}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            onAddToCart={handleAddToCart}
          />
        } />
        <Route path="/cart" element={
          <ShoppingBag
            cartItems={cart}
            coupons={coupons}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          />
        } />
        <Route path="/checkout" element={
          currentUser ? (
            <SecureCheckout
              currentUser={currentUser}
              cart={cart}
              onPlaceOrder={handlePlaceOrder}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Authentication Portals */}
        <Route path="/login" element={
          <LoginOnyx
            onLogin={handleLogin}
          />
        } />
        <Route path="/recovery" element={<PasswordRecovery />} />
        <Route path="/register" element={
          <Registration
            onLogin={handleLogin}
          />
        } />

        {/* Notifications */}
        <Route path="/notifications" element={
          <Notifications 
            currentUser={currentUser} 
            notifications={notifications} 
            onMarkAsRead={handleMarkAsRead} 
          />
        } />

        {/* Client Profile */}
        <Route path="/profile" element={
          <MyProfile
            currentUser={currentUser}
            orders={orders.filter(o => o.customerEmail === currentUser?.email)}
            bespokeRequests={bespokeRequests.filter(r => r.clientEmail === currentUser?.email)}
            coupons={coupons}
            newCouponNotification={newCouponNotification}
            clearNotification={() => setNewCouponNotification(false)}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onUpdateBespokeRequest={handleUpdateBespokeRequest}
            onDeleteBespokeRequest={handleDeleteBespokeRequest}
            cart={cart}
            setCart={setCart}
          />
        } />
        <Route path="/orders" element={
          <YourOrders
            currentUser={currentUser}
            orders={orders.filter(o => o.customerEmail === currentUser?.email)}
          />
        } />
        <Route path="/bespoke-requests" element={
          <BespokeRequests
            currentUser={currentUser}
            bespokeRequests={bespokeRequests.filter(r => r.clientEmail === currentUser?.email)}
            onUpdateBespokeRequest={handleUpdateBespokeRequest}
            onDeleteBespokeRequest={handleDeleteBespokeRequest}
          />
        } />
        <Route path="/custom-order" element={
          <ClientSubmission
            currentUser={currentUser}
            onSubmitBespokeRequest={handleSubmitBespokeRequest}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          />
        } />

        {/* Static details */}
        <Route path="/about" element={<AboutHeritage cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />} />
        <Route path="/contact" element={<ContactUs cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onAddInquiry={handleAddInquiry} />} />
        <Route path="/terms" element={<Terms />} />

        {/* Admin Console Dashboard */}
        <Route path="/admin" element={
          currentUser?.role === 'admin' ? (
            <AdminConsole
              currentUser={currentUser}
              orders={orders}
              bespokeRequests={bespokeRequests}
              coupons={coupons}
              products={products}
              users={users}
              inquiries={inquiries}
              onApproveBespoke={handleApproveBespoke}
              onRejectBespoke={handleRejectBespoke}
              onCrossQuestionBespoke={handleCrossQuestionBespoke}
            />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
              <i className="fa-solid fa-shield-halved mb-4" style={{ fontSize: '72px', color: '#d4af37' }}></i>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', color: '#d4af37' }}>403 Access Denied</h1>
              <p className="text-muted mt-3" style={{ fontSize: '18px', maxWidth: '500px', lineHeight: '1.6' }}>You do not have the required admin permissions to access this page.</p>
              <Link to="/profile" className="btn btn-outline-gold mt-4 px-4 py-2" style={{ border: '1px solid #d4af37', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none' }}>Return to Profile</Link>
            </div>
          )
        } />
        <Route path="/admin/products" element={
          currentUser?.role === 'admin' ? (
            <AdminProduct
              currentUser={currentUser}
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProduct={handleUpdateProduct}
            />
          ) : <Navigate to="/admin" replace />
        } />
        <Route path="/admin/orders" element={
          currentUser?.role === 'admin' ? (
            <AdminOrder
              currentUser={currentUser}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ) : <Navigate to="/admin" replace />
        } />
        <Route path="/admin/coupons" element={
          currentUser?.role === 'admin' ? (
            <AdminCoupon
              currentUser={currentUser}
              coupons={coupons}
              onAddCoupon={handleAddCoupon}
              onDeleteCoupon={handleDeleteCoupon}
            />
          ) : <Navigate to="/admin" replace />
        } />
        <Route path="/admin/users" element={
          currentUser?.role === 'admin' ? (
            <AdminUser
              currentUser={currentUser}
              users={users}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleUserBlock={handleToggleUserBlock}
            />
          ) : <Navigate to="/admin" replace />
        } />
        <Route path="/admin/inquiries" element={
          <AdminInquiry currentUser={currentUser} inquiries={inquiries} />
        } />
        <Route path="/admin/custom-orders" element={
          <AdminCustomOrder 
            currentUser={currentUser} 
            bespokeRequests={bespokeRequests}
            onApproveBespoke={handleApproveBespoke}
            onRejectBespoke={handleRejectBespoke}
            onCrossQuestionBespoke={handleCrossQuestionBespoke}
          />
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* =========================================================
           GLOBAL HUD: BOTTOM-LEFT MENU & BOTTOM-RIGHT LIGHT COIN
      ========================================================= */}

      {/* 1. Global Header Hider Override */}
      <style>{`
        /* Global Header Overrides - Hides traditional top Navbars globally as requested */
        header, 
        .site-header, 
        .lux-navbar, 
        .checkout-header, 
        .portal-topbar, 
        .aurelian-header-dark {
            display: none !important;
        }

        /* Adjust main page containers for headerless layout */
        #lux-home-page,
        .collection-page,
        #lux-product-page,
        .cart-page,
        .checkout-page,
        #hrrerr,
        .aurelian-custom-order-dark,
        .heritage-page,
        .contact-page {
            padding-top: 80px !important;
        }

        /* Global Footer Copyright Centering */
        .footer-bottom {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            padding: 20px 0 !important;
        }

        /* View All Categories custom link */
        .view-all-link {
            color: rgba(255, 255, 255, 0.7) !important;
            text-decoration: none;
            transition: color 0.3s;
        }

        .view-all-link:hover {
            color: #d4af37 !important;
        }
      `}</style>



      {/* Removed Navigator Drawer Left */}

      </Router>
    </NotificationProvider>
  );
};

export default App;
