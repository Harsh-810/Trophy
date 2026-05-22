import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/UnifiedToast';
import Swal from 'sweetalert2';

const MyProfile = ({ 
  currentUser, 
  orders = [], 
  bespokeRequests = [], 
  coupons = [], 
  newCouponNotification = false, 
  clearNotification, 
  onLogout, 
  onUpdateProfile, 
  cart = [], 
  setCart 
}) => {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Basic Profile Forms State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileGender, setProfileGender] = useState('Male');
  const [profileDob, setProfileDob] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Address Form State
  const [homeAddress, setHomeAddress] = useState({ address: '', pinCode: '', state: '', city: '', landmark: '' });
  const [officeAddress, setOfficeAddress] = useState({ address: '', pinCode: '', state: '', city: '', landmark: '' });

  // Payments Form State
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newUpiId, setNewUpiId] = useState('');
  const [refillAmount, setRefillAmount] = useState('1000');
  const [giftCode, setGiftCode] = useState('');

  // Support Tickets State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Wishlist and shopping references (Simulated database structure bound to profile)
  const wishlist = useMemo(() => currentUser?.wishlist || [], [currentUser]);
  const walletBalance = currentUser?.walletBalance ?? 5000;
  const isPrime = currentUser?.isPrime ?? false;
  const addresses = useMemo(() => currentUser?.addresses || {
    home: { address: '', pinCode: '', state: '', city: '', landmark: '' },
    office: { address: '', pinCode: '', state: '', city: '', landmark: '' }
  }, [currentUser]);
  
  const paymentDetails = useMemo(() => currentUser?.paymentDetails || {
    savedCards: [{ id: '1', number: '•••• •••• •••• 8824', holder: currentUser?.name || 'Aurelian Member', expiry: '12/29', brand: 'Visa' }],
    upiIds: [currentUser?.email ? `${currentUser.name.toLowerCase().replace(/\s+/g, '')}@okaxis` : 'member@okaxis'],
    netBanking: ['HDFC Royal Curatorial Account']
  }, [currentUser]);

  const supportTickets = useMemo(() => currentUser?.supportTickets || [
    { id: 'TKT-8802', subject: 'Curatorial finish request', message: 'Standard polish instead of matte coating.', status: 'Resolved', date: 'May 20, 2026' }
  ], [currentUser]);

  const referralEarnings = currentUser?.referralEarnings ?? 1500;
  const referralList = useMemo(() => currentUser?.referralList || ['Arjun Mehta', 'Priya Sharma', 'Rohit Sen'], [currentUser]);

  // Load Form Settings from database user object
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileGender(currentUser.gender || 'Male');
      setProfileDob(currentUser.dob || '');
      setProfileAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80');
      
      if (currentUser.addresses) {
        if (currentUser.addresses.home) setHomeAddress(currentUser.addresses.home);
        if (currentUser.addresses.office) setOfficeAddress(currentUser.addresses.office);
      }
    }
  }, [currentUser]);

  // Main generic sync patch helper
  const syncUserWithDb = async (updatedFields) => {
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const updated = await res.json();
        if (onUpdateProfile) onUpdateProfile(updated);
        triggerNotification('Vault database credentials synchronized.', 'success', 'Registry Saved');
      } else {
        triggerNotification('Database offline. Local details updated.', 'info', 'Registry Local');
        if (onUpdateProfile) onUpdateProfile({ ...currentUser, ...updatedFields });
      }
    } catch (err) {
      console.error(err);
      triggerNotification('Registry synchronization updated locally.', 'info', 'Registry Local');
      if (onUpdateProfile) onUpdateProfile({ ...currentUser, ...updatedFields });
    } finally {
      setIsSaving(false);
    }
  };

  // Protect route
  if (!currentUser) {
    return (
      <div className="text-center py-5" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <i className="fa-solid fa-lock mb-4" style={{ fontSize: '64px', color: '#e4c24b' }}></i>
        <h2>Private Vault Access</h2>
        <p className="text-muted">You must identify yourself to access the private portal.</p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-outline-gold px-4" style={{ border: '1px solid #e4c24b', color: '#e4c24b' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  // Preset Avatar Icons List
  const avatarPresets = [
    { name: 'Gold Crown', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' },
    { name: 'Ebony Diamond', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80' },
    { name: 'Aurelian Plaque', url: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?auto=format&fit=crop&w=150&q=80' },
    { name: 'Onyx Crest', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=150&q=80' }
  ];

  // Calculations
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const patch = {
      name: profileName,
      phone: profilePhone,
      gender: profileGender,
      dob: profileDob,
      avatar: profileAvatar
    };
    if (newPassword && currentPassword) {
      if (currentPassword !== currentUser.password) {
        triggerNotification('Current password does not match.', 'error', 'Security Breach');
        return;
      }
      patch.password = newPassword;
      setCurrentPassword('');
      setNewPassword('');
    }
    syncUserWithDb(patch);
  };

  // Address Save
  const handleSaveAddress = (e) => {
    e.preventDefault();
    syncUserWithDb({
      addresses: {
        home: homeAddress,
        office: officeAddress
      }
    });
  };

  // Toggle VIP Prime
  const handleTogglePrime = () => {
    const nextPrime = !isPrime;
    syncUserWithDb({ isPrime: nextPrime });
    triggerNotification(
      nextPrime ? 'Aurelian Elite VIP Prime status activated!' : 'Elite VIP subscription cancelled.',
      nextPrime ? 'success' : 'info',
      'VIP Tier Update'
    );
  };

  // Refill Wallet
  const handleRefillWallet = () => {
    const amt = parseFloat(refillAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerNotification('Please enter a valid amount.', 'error');
      return;
    }
    syncUserWithDb({ walletBalance: walletBalance + amt });
    triggerNotification(`₹${amt.toLocaleString()} added to your secure wallet.`, 'success', 'Wallet Refilled');
  };

  // Redeem Gift Code
  const handleRedeemGift = (e) => {
    e.preventDefault();
    if (!giftCode.trim()) return;
    const value = Math.floor(100 + Math.random() * 900);
    syncUserWithDb({ walletBalance: walletBalance + value });
    triggerNotification(`Gift Card Redeemed! ₹${value} credited to your Wallet.`, 'success', 'Gift Redeemed');
    setGiftCode('');
  };

  // Add Credit Card
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardNumber || !newCardHolder || !newCardExpiry) {
      triggerNotification('Please complete card parameters.', 'error');
      return;
    }
    const updatedCards = [...paymentDetails.savedCards, {
      id: String(Date.now()),
      number: `•••• •••• •••• ${newCardNumber.slice(-4)}`,
      holder: newCardHolder,
      expiry: newCardExpiry,
      brand: newCardBrand
    }];
    syncUserWithDb({
      paymentDetails: { ...paymentDetails, savedCards: updatedCards }
    });
    setNewCardNumber('');
    setNewCardHolder('');
    setNewCardExpiry('');
    triggerNotification('New secure card added to vault.', 'success', 'Card Vaulted');
  };

  // Add UPI ID
  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpiId) return;
    const updatedUpis = [...paymentDetails.upiIds, newUpiId];
    syncUserWithDb({
      paymentDetails: { ...paymentDetails, upiIds: updatedUpis }
    });
    setNewUpiId('');
    triggerNotification('UPI ID registered.', 'success');
  };

  // Delete Card
  const handleDeleteCard = (cardId) => {
    const updatedCards = paymentDetails.savedCards.filter(c => c.id !== cardId);
    syncUserWithDb({
      paymentDetails: { ...paymentDetails, savedCards: updatedCards }
    });
    triggerNotification('Card removed from secure registry.', 'info');
  };

  // Support Ticket Submission
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      message: ticketMessage,
      status: 'Pending Curator',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const updatedTickets = [newTicket, ...supportTickets];
    syncUserWithDb({ supportTickets: updatedTickets });
    setTicketSubject('');
    setTicketMessage('');
    triggerNotification('Inquiry ticket logged with concierge staff.', 'success', 'Ticket Dispatched');
  };

  // Wishlist actions
  const handleRemoveWishlist = (prodId) => {
    const updatedWishlist = wishlist.filter(id => id !== prodId);
    syncUserWithDb({ wishlist: updatedWishlist });
    triggerNotification('Removed from wishlist collection.', 'info');
  };

  const handleMoveToCart = (item) => {
    // Add to cart simulator
    const exists = cart.find(i => i.id === item.id);
    let newCart;
    if (exists) {
      newCart = cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }
    setCart(newCart);
    
    // Remove from wishlist
    const updatedWishlist = wishlist.filter(id => id !== item.id);
    syncUserWithDb({ wishlist: updatedWishlist });
    triggerNotification(`"${item.name}" moved to cart cabinet!`, 'success', 'Shopping Cart');
  };

  // Order Cancellation simulation
  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: 'Cancel Order?',
      text: `Are you sure you want to cancel order #${orderId}?`,
      icon: 'warning',
      iconColor: '#d4af37',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'Keep Active',
      background: '#111112',
      color: '#f5f1e8',
      customClass: {
        popup: 'swal2-aurelian-popup',
        confirmButton: 'swal2-aurelian-confirm',
        cancelButton: 'swal2-aurelian-cancel'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3001/orders/${orderId}`);
          if (res.ok) {
            const ord = await res.json();
            const res2 = await fetch(`http://localhost:3001/orders/${orderId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Cancelled' })
            });
            if (res2.ok) {
              triggerNotification(`Order #${orderId} has been successfully cancelled.`, 'info', 'Order Cancelled');
              // reload orders
              setTimeout(() => navigate('/profile'), 1500);
            }
          }
        } catch (e) {
          triggerNotification('Offline mode: Cancel request registered.', 'info');
        }
      }
    });
  };

  // Return Order Request simulation
  const handleRequestReturn = (orderId) => {
    Swal.fire({
      title: 'Submit Return Request?',
      text: `Are you sure you want to file a return request for Order #${orderId}?`,
      icon: 'question',
      iconColor: '#d4af37',
      showCancelButton: true,
      confirmButtonText: 'File Request',
      cancelButtonText: 'Cancel',
      background: '#111112',
      color: '#f5f1e8',
      customClass: {
        popup: 'swal2-aurelian-popup',
        confirmButton: 'swal2-aurelian-confirm',
        cancelButton: 'swal2-aurelian-cancel'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Return Requests' })
          });
          if (res.ok) {
            triggerNotification('Return filing registered. Waiting for admin approval.', 'success', 'Return Filed');
            setTimeout(() => navigate('/profile'), 1500);
          }
        } catch (e) {
          triggerNotification('Return filing registered.', 'success');
        }
      }
    });
  };

  // Buy Again simulator
  const handleBuyAgain = (item) => {
    const newCart = [...cart, { ...item, quantity: 1 }];
    setCart(newCart);
    triggerNotification(`"${item.name}" added to shopping bag.`, 'success', 'Cart Refilled');
    navigate('/cart');
  };

  // Referral Friend simulator
  const handleReferFriend = () => {
    const friendNames = ['Aadesh Gupta', 'Neha Nair', 'Vikram Rao', 'Siddharth Roy', 'Riya Varma'];
    const randomFriend = friendNames[Math.floor(Math.random() * friendNames.length)];
    
    const updatedReferrals = [...referralList, randomFriend];
    syncUserWithDb({
      referralEarnings: referralEarnings + 500,
      referralList: updatedReferrals,
      walletBalance: walletBalance + 500
    });
    triggerNotification(`Simulated referral: ${randomFriend} signed up! ₹500 credited to your Wallet.`, 'success', 'Referral Earned');
  };

  return (
    <>
      <style>{`
        #hrrerr {
            font-family: 'Inter', sans-serif;
            background: #050508;
            color: #f5f2ec;
            min-height: 100vh;
        }
        #hrrerr a {
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .portal-layout {
            display: flex;
            min-height: 100vh;
        }
        .portal-sidebar {
            width: 320px;
            background: #0a0a0e;
            border-right: 1px solid rgba(216, 184, 75, 0.15);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px 30px;
        }
        .sidebar-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 38px;
            font-weight: 700;
            background: linear-gradient(90deg, #d8b84b, #f0d05c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 30px;
        }
        .sidebar-nav {
            gap: 8px;
        }
        .sidebar-nav .nav-link-btn {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            font-weight: 500;
            padding: 12px 18px;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-align: left;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s ease;
        }
        .sidebar-nav .nav-link-btn:hover {
            color: #d8b84b;
            background: rgba(216, 184, 75, 0.05);
        }
        .sidebar-nav .nav-link-btn.active {
            color: #d8b84b;
            background: rgba(216, 184, 75, 0.1);
            border-left: 3px solid #d8b84b;
        }
        .portal-content {
            flex: 1;
            padding: 50px 60px;
            background: radial-gradient(circle at top right, #0d0d14, #050508);
            overflow-y: auto;
        }
        .premium-card {
            background: rgba(15, 15, 20, 0.7);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(216, 184, 75, 0.15);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
        }
        .premium-card:hover {
            border-color: rgba(216, 184, 75, 0.3);
            box-shadow: 0 15px 40px rgba(216,184,75,0.05);
        }
        .card-header-luxury {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .card-title-luxury {
            font-family: 'Cormorant Garamond', serif;
            font-size: 26px;
            color: #fff;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .gold-badge {
            background: linear-gradient(90deg, #d8b84b, #f0d05c);
            color: #000;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 4px;
        }
        .btn-gold {
            background: linear-gradient(90deg, #d8b84b, #f0d05c);
            border: none;
            color: #000;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px 24px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        .btn-gold:hover {
            background: linear-gradient(90deg, #e4c24b, #ffe175);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(216, 184, 75, 0.25);
        }
        .btn-outline-gold {
            background: transparent;
            border: 1px solid #d8b84b;
            color: #d8b84b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 10px 24px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        .btn-outline-gold:hover {
            background: rgba(216, 184, 75, 0.1);
            color: #fff;
        }
        .avatar-presets-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        .avatar-preset-item {
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .avatar-preset-item.active {
            border-color: #d8b84b;
            box-shadow: 0 0 15px rgba(216, 184, 75, 0.5);
        }
        .avatar-preset-item img {
            width: 100%;
            height: 80px;
            object-fit: cover;
        }
        .visual-card {
            width: 100%;
            max-width: 380px;
            height: 220px;
            background: linear-gradient(135deg, #18181c, #0a0a0c);
            border: 1px solid rgba(216, 184, 75, 0.25);
            border-radius: 16px;
            padding: 25px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 15px 30px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
        }
        .visual-card::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(216,184,75,0.1), transparent 70%);
            pointer-events: none;
        }
        .form-control-dark {
            background: #111114 !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #f5f2ec !important;
            border-radius: 6px !important;
            padding: 12px 16px !important;
        }
        .form-control-dark:focus {
            border-color: #d8b84b !important;
            box-shadow: 0 0 10px rgba(216, 184, 75, 0.15) !important;
            background: #141418 !important;
        }
        .table-luxury {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
        }
        .table-luxury th {
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            padding: 0 15px;
        }
        .table-luxury tr {
            transition: all 0.3s ease;
        }
        .table-luxury td {
            background: rgba(15, 15, 20, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 18px 20px;
            vertical-align: middle;
        }
        .table-luxury td:first-child {
            border-left: 1px solid rgba(255, 255, 255, 0.05);
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        .table-luxury td:last-child {
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(216, 184, 75, 0.1);
            color: #d8b84b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
      `}</style>

      <div id="hrrerr">
        <div className="portal-layout">
          {/* SIDEBAR NAVIGATION */}
          <aside className="portal-sidebar">
            <div>
              <div className="sidebar-brand">Aurelian</div>
              
              <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom border-secondary border-opacity-10">
                <img 
                  src={profileAvatar} 
                  alt={currentUser.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #d8b84b' }}
                />
                <div>
                  <div className="fw-bold text-white small">{currentUser.name}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>
                    {isPrime ? 'Elite VIP Member' : 'Registry Client'}
                  </div>
                </div>
              </div>

              <nav className="sidebar-nav d-flex flex-column">
                <button onClick={() => setActiveTab('overview')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'overview' ? 'active' : ''}`}>
                  <i className="fa-solid fa-table-columns"></i> Dashboard
                </button>
                <button onClick={() => setActiveTab('profile')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'profile' ? 'active' : ''}`}>
                  <i className="fa-regular fa-user"></i> My Credentials
                </button>
                <button onClick={() => setActiveTab('address')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'address' ? 'active' : ''}`}>
                  <i className="fa-solid fa-map-location-dot"></i> Address Vault
                </button>
                <button onClick={() => setActiveTab('shopping')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'shopping' ? 'active' : ''}`}>
                  <i className="fa-solid fa-bag-shopping"></i> Shopping Shelf
                </button>
                <button onClick={() => setActiveTab('payments')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'payments' ? 'active' : ''}`}>
                  <i className="fa-solid fa-wallet"></i> Payments & Wallet
                </button>
                <button onClick={() => setActiveTab('rewards')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'rewards' ? 'active' : ''}`}>
                  <i className="fa-solid fa-award"></i> VIP Guild & Tickets
                </button>
                <button onClick={() => setActiveTab('settings')} className={`btn border-0 w-100 nav-link-btn ${activeTab === 'settings' ? 'active' : ''}`}>
                  <i className="fa-solid fa-gears"></i> Preferences & Security
                </button>
              </nav>
            </div>

            <div className="pt-4 border-top border-secondary border-opacity-10">
              {currentUser.role === 'admin' && (
                <Link to="/admin" className="btn nav-link-btn text-warning mb-2 w-100">
                  <i className="fa-solid fa-screwdriver-wrench"></i> Admin Console
                </Link>
              )}
              <button onClick={onLogout} className="btn nav-link-btn text-danger w-100">
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Lock Session
              </button>
            </div>
          </aside>

          {/* MAIN CONTAINER CONTENT */}
          <main className="portal-content">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <section>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="text-uppercase tracking-wider" style={{ color: '#d8b84b', fontSize: '11px', letterSpacing: '2px' }}>Curatorial Workspace</h5>
                    <h1 className="fw-bold text-white mb-0" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px' }}>Client Sanctuary</h1>
                  </div>
                  {isPrime && <span className="gold-badge py-2 px-3"><i className="fa-solid fa-gem me-1"></i> Elite VIP Active</span>}
                </div>

                {/* Stat grid */}
                <div className="row g-4 mb-5">
                  <div className="col-md-3">
                    <div className="premium-card h-100 mb-0 d-flex align-items-center gap-3">
                      <div className="stat-icon"><i className="fa-solid fa-shield-halved"></i></div>
                      <div>
                        <div className="text-muted uppercase small tracking-wider" style={{ fontSize: '10px' }}>Total Curated</div>
                        <div className="h3 fw-bold text-white mb-0">₹{totalSpent.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="premium-card h-100 mb-0 d-flex align-items-center gap-3">
                      <div className="stat-icon"><i className="fa-solid fa-cubes"></i></div>
                      <div>
                        <div className="text-muted uppercase small tracking-wider" style={{ fontSize: '10px' }}>Orders count</div>
                        <div className="h3 fw-bold text-white mb-0">{orders.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="premium-card h-100 mb-0 d-flex align-items-center gap-3">
                      <div className="stat-icon"><i className="fa-solid fa-heart"></i></div>
                      <div>
                        <div className="text-muted uppercase small tracking-wider" style={{ fontSize: '10px' }}>Wishlist items</div>
                        <div className="h3 fw-bold text-white mb-0">{wishlist.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="premium-card h-100 mb-0 d-flex align-items-center gap-3">
                      <div className="stat-icon"><i className="fa-solid fa-wallet"></i></div>
                      <div>
                        <div className="text-muted uppercase small tracking-wider" style={{ fontSize: '10px' }}>Wallet funds</div>
                        <div className="h3 fw-bold text-white mb-0">₹{walletBalance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Prime Panel */}
                  <div className="col-lg-6">
                    <div className="premium-card h-100" style={{ background: isPrime ? 'linear-gradient(135deg, rgba(216,184,75,0.08) 0%, rgba(5,5,8,0.7) 100%)' : '' }}>
                      <div className="card-header-luxury">
                        <h3 className="card-title-luxury"><i className="fa-solid fa-gem text-warning"></i> Elite VIP Club</h3>
                      </div>
                      <p className="text-muted small">
                        Unlock elite privileges, including complimentary vault-insured delivery, priority curation queue, 24/7 designated hotline, and invites to private auctions.
                      </p>
                      <div className="pt-4 d-flex justify-content-between align-items-center">
                        <span className="text-white fw-bold">{isPrime ? 'Active Subscription' : 'Upgrade Premium Curation'}</span>
                        <button className="btn btn-gold" onClick={handleTogglePrime}>
                          {isPrime ? 'Downgrade Access' : 'Upgrade to Elite'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Exhibition RSVP */}
                  <div className="col-lg-6">
                    <div className="premium-card h-100">
                      <div className="card-header-luxury">
                        <h3 className="card-title-luxury"><i className="fa-regular fa-calendar-check text-warning"></i> Curatorial Gala Event</h3>
                      </div>
                      <div className="mb-4">
                        <strong className="text-white d-block mb-1">Onyx VIP Gala 2026</strong>
                        <span className="text-muted small d-block">Location: The Grand Curatorial Vaults, Mumbai</span>
                        <span className="text-muted small">Date: October 18, 2026 at 7:00 PM IST</span>
                      </div>
                      <button className="btn btn-outline-gold w-100 py-3" onClick={() => triggerNotification('Your Gala VIP seat RSVP has been logged successfully!', 'success', 'RSVP Confirmed')}>
                        Confirm Attendance (RSVP VIP)
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 2. CREDENTIALS TAB */}
            {activeTab === 'profile' && (
              <section className="premium-card">
                <div className="card-header-luxury">
                  <h3 className="card-title-luxury"><i className="fa-regular fa-address-card text-warning"></i> Identity Credentials</h3>
                </div>

                <form onSubmit={handleSaveProfile}>
                  <div className="row g-4">
                    {/* Avatar Customizer */}
                    <div className="col-12 mb-3">
                      <label className="form-label text-warning small uppercase tracking-wider">Registry Avatar Portrait</label>
                      <div className="d-flex align-items-center gap-4 flex-wrap">
                        <img 
                          src={profileAvatar} 
                          alt="Preset Selected" 
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d8b84b' }}
                        />
                        <div className="flex-grow-1">
                          <input 
                            type="text" 
                            className="form-control form-control-dark w-100" 
                            placeholder="Or paste external custom image URL..."
                            value={profileAvatar}
                            onChange={(e) => setProfileAvatar(e.target.value)}
                          />
                          <div className="avatar-presets-grid mt-2">
                            {avatarPresets.map((pr) => (
                              <div 
                                key={pr.name} 
                                className={`avatar-preset-item ${profileAvatar === pr.url ? 'active' : ''}`}
                                onClick={() => setProfileAvatar(pr.url)}
                              >
                                <img src={pr.url} alt={pr.name} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label text-warning small uppercase tracking-wider">Full Registry Name</label>
                        <input 
                          type="text" 
                          className="form-control form-control-dark" 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label text-secondary small uppercase tracking-wider"><i className="fa-solid fa-lock"></i> Protected Account Email</label>
                        <input type="email" className="form-control form-control-dark text-muted" value={currentUser.email} disabled readOnly style={{ cursor: 'not-allowed', background: '#0a0a0c !important' }} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label text-warning small uppercase tracking-wider">Mobile Registry Phone</label>
                        <input 
                          type="text" 
                          className="form-control form-control-dark" 
                          placeholder="+91 XXXXX XXXXX" 
                          value={profilePhone} 
                          onChange={(e) => setProfilePhone(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group mb-3">
                        <label className="form-label text-warning small uppercase tracking-wider">Gender</label>
                        <select className="form-select form-control form-control-dark" value={profileGender} onChange={(e) => setProfileGender(e.target.value)}>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to state</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group mb-3">
                        <label className="form-label text-warning small uppercase tracking-wider">Date of Birth</label>
                        <input 
                          type="date" 
                          className="form-control form-control-dark" 
                          value={profileDob} 
                          onChange={(e) => setProfileDob(e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* Password Changer */}
                    <div className="col-12 border-top border-secondary border-opacity-10 pt-4 mt-4">
                      <h5 className="text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px' }}>Update Vault Access Key (Password)</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <input 
                            type="password" 
                            className="form-control form-control-dark" 
                            placeholder="Current Vault Key (Password)" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <input 
                            type="password" 
                            className="form-control form-control-dark" 
                            placeholder="New Secure Vault Key" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4">
                    <button type="submit" className="btn btn-gold px-5 py-3" disabled={isSaving}>
                      {isSaving ? 'Updating Registry...' : 'Save Registry Credentials'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* 3. ADDRESS VAULT TAB */}
            {activeTab === 'address' && (
              <section className="premium-card">
                <div className="card-header-luxury">
                  <h3 className="card-title-luxury"><i className="fa-solid fa-map-location-dot text-warning"></i> Secured Delivery Vaults</h3>
                </div>

                <form onSubmit={handleSaveAddress}>
                  <div className="row g-5">
                    {/* Home Address Card */}
                    <div className="col-lg-6 border-end border-secondary border-opacity-10">
                      <h4 className="text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px' }}><i className="fa-solid fa-house text-warning me-2"></i> Primary Residence Vault</h4>
                      
                      <div className="mb-3">
                        <label className="form-label text-muted small uppercase">Street Address</label>
                        <textarea 
                          className="form-control form-control-dark" 
                          rows="2" 
                          placeholder="Home address details..."
                          value={homeAddress.address}
                          onChange={(e) => setHomeAddress({ ...homeAddress, address: e.target.value })}
                        ></textarea>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-muted small">PIN Code</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="400001"
                            value={homeAddress.pinCode}
                            onChange={(e) => setHomeAddress({ ...homeAddress, pinCode: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">Landmark</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Near Palace"
                            value={homeAddress.landmark}
                            onChange={(e) => setHomeAddress({ ...homeAddress, landmark: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">City</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Mumbai"
                            value={homeAddress.city}
                            onChange={(e) => setHomeAddress({ ...homeAddress, city: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">State</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Maharashtra"
                            value={homeAddress.state}
                            onChange={(e) => setHomeAddress({ ...homeAddress, state: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Office Address Card */}
                    <div className="col-lg-6">
                      <h4 className="text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px' }}><i className="fa-solid fa-briefcase text-warning me-2"></i> Corporate HQ Vault</h4>
                      
                      <div className="mb-3">
                        <label className="form-label text-muted small uppercase">Street Address</label>
                        <textarea 
                          className="form-control form-control-dark" 
                          rows="2" 
                          placeholder="Corporate address details..."
                          value={officeAddress.address}
                          onChange={(e) => setOfficeAddress({ ...officeAddress, address: e.target.value })}
                        ></textarea>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-muted small">PIN Code</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="110001"
                            value={officeAddress.pinCode}
                            onChange={(e) => setOfficeAddress({ ...officeAddress, pinCode: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">Landmark</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Tower A, Tech Park"
                            value={officeAddress.landmark}
                            onChange={(e) => setOfficeAddress({ ...officeAddress, landmark: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">City</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="New Delhi"
                            value={officeAddress.city}
                            onChange={(e) => setOfficeAddress({ ...officeAddress, city: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small">State</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Delhi"
                            value={officeAddress.state}
                            onChange={(e) => setOfficeAddress({ ...officeAddress, state: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-top border-secondary border-opacity-10">
                    <button type="submit" className="btn btn-gold px-5 py-3" disabled={isSaving}>
                      {isSaving ? 'Syncing Address Vaults...' : 'Save Vault Address Directory'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* 4. SHOPPING SHELF TAB */}
            {activeTab === 'shopping' && (
              <section>
                {/* 4.1 Cart items */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-cart-shopping text-warning"></i> Active Cart Drawer ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>
                    <Link to="/cart" className="btn-outline-gold btn btn-sm py-2 px-3">Checkout Cabinet</Link>
                  </div>
                  {cart.length === 0 ? (
                    <p className="text-muted small">Your curation cart drawer is empty.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table-luxury">
                        <thead>
                          <tr>
                            <th>Master Trophy</th>
                            <th>Quantity</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center gap-3">
                                  <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                                  <div>
                                    <strong className="text-white">{item.name}</strong>
                                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>₹{item.price.toLocaleString()}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-light">{item.quantity} Unit(s)</td>
                              <td className="text-end text-warning fw-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4.2 Wishlist cabinet */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-heart text-warning"></i> Private Collection Wishlist</h3>
                  </div>
                  {wishlist.length === 0 ? (
                    <p className="text-muted small">No items saved in private catalog wishlist.</p>
                  ) : (
                    <div className="row g-4">
                      {wishlist.map((prodId) => (
                        <div className="col-md-6" key={prodId}>
                          <div className="card bg-black border border-secondary border-opacity-10 rounded-3">
                            <div className="card-body p-3 d-flex align-items-center justify-content-between">
                              <span className="text-white fw-bold" style={{ fontSize: '14px' }}>Item Reference ID: {prodId}</span>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-gold py-1 px-3" onClick={() => handleMoveToCart({ id: prodId, name: 'Curated Trophy Piece', price: 12000, image: 'https://imgs.search.brave.com/gUe-1L-vJ0PyF7vBDop-FDkC2LYOWhR0XOos6opz_KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAw/Mzc1MzYxLTAwMS9w/aG90by9hc3NvcnRl/ZC10cm9waGllcy5q/cGc_cz02MTJ4NjEye/Jnc9MCZrPTIwJmM9/TlBBQjZTSjZ3eHVz/c3BzWVM2cktJbWxa/NVlZeGNZbzBhV0hi/TWlEeW1aYz0' })}>
                                  <i className="fa-solid fa-cart-arrow-down"></i> Add to Cart
                                </button>
                                <button className="btn btn-sm text-danger border-0 bg-transparent" onClick={() => handleRemoveWishlist(prodId)}>
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4.3 Order history with buy again/cancel/return */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-list-check text-warning"></i> Luxury Curation Orders History</h3>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-muted small">No order entries logged under your registry key.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table-luxury">
                        <thead>
                          <tr>
                            <th>Order Ledger</th>
                            <th>Dispatch Date</th>
                            <th>Total Sum</th>
                            <th>Clearance Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((ord) => (
                            <tr key={ord.orderId}>
                              <td>
                                <strong className="text-white">#{ord.orderId}</strong>
                                <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                                  {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                </span>
                              </td>
                              <td className="text-white-50">{ord.date}</td>
                              <td className="text-warning font-weight-bold">₹{ord.total.toLocaleString()}</td>
                              <td>
                                <span className={`badge py-1 px-3 ${
                                  ord.status === 'Delivered' ? 'bg-success text-dark' :
                                  ord.status === 'Cancelled' ? 'bg-danger text-light' :
                                  ord.status === 'Return Requests' ? 'bg-info text-dark' :
                                  'bg-warning text-dark'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <button className="btn btn-sm btn-gold py-1 px-3" style={{ fontSize: '11px' }} onClick={() => handleBuyAgain(ord.items[0] || { id: 'generic', name: 'Curated Trophy Masterpiece', price: ord.total, image: 'https://imgs.search.brave.com/gUe-1L-vJ0PyF7vBDop-FDkC2LYOWhR0XOos6opz_KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAw/Mzc1MzYxLTAwMS9w/aG90by9hc3NvcnRl/ZC10cm9waGllcy5q/cGc_cz02MTJ4NjEye/Jnc9MCZrPTIwJmM9/TlBBQjZTSjZ3eHVz/c3BzWVM2cktJbWxa/NVlZeGNZbzBhV0hi/TWlEeW1aYz0' })}>
                                    Buy Again
                                  </button>
                                  {ord.status === 'Pending Approval' && (
                                    <button className="btn btn-sm btn-outline-danger py-1 px-3 text-danger border border-danger border-opacity-30" style={{ fontSize: '11px', background: 'transparent' }} onClick={() => handleCancelOrder(ord.orderId)}>
                                      Cancel
                                    </button>
                                  )}
                                  {ord.status === 'Delivered' && (
                                    <button className="btn btn-sm btn-outline-gold py-1 px-3" style={{ fontSize: '11px' }} onClick={() => handleRequestReturn(ord.orderId)}>
                                      Return Request
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 5. PAYMENTS & WALLET TAB */}
            {activeTab === 'payments' && (
              <section>
                {/* 5.1 Refill wallet */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-coins text-warning"></i> Secure Vault Treasury (Wallet)</h3>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <div>
                      <span className="text-muted d-block small uppercase">Aurelian Vault Balance</span>
                      <h2 className="text-white fw-bold mb-0" style={{ fontSize: '40px', fontFamily: 'Cormorant Garamond, serif' }}>₹{walletBalance.toLocaleString()}</h2>
                    </div>
                    
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="number" 
                        className="form-control form-control-dark" 
                        style={{ width: '130px' }} 
                        value={refillAmount} 
                        onChange={(e) => setRefillAmount(e.target.value)} 
                      />
                      <button className="btn btn-gold" onClick={handleRefillWallet}>Refill Funds</button>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <button className="btn btn-sm btn-outline-gold" onClick={() => setRefillAmount('500')}>+ ₹500</button>
                    <button className="btn btn-sm btn-outline-gold" onClick={() => setRefillAmount('1000')}>+ ₹1,000</button>
                    <button className="btn btn-sm btn-outline-gold" onClick={() => setRefillAmount('5000')}>+ ₹5,000</button>
                  </div>
                </div>

                {/* 5.2 Saved Cards */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-credit-card text-warning"></i> Registered Vault Cards</h3>
                  </div>

                  <div className="row g-4">
                    {/* Visual Card lists */}
                    <div className="col-lg-6">
                      <div className="d-flex flex-column gap-3">
                        {paymentDetails.savedCards.map((card) => (
                          <div className="visual-card" key={card.id}>
                            <div className="d-flex justify-content-between align-items-start">
                              <span className="text-warning font-monospace" style={{ letterSpacing: '2px', fontSize: '18px', fontWeight: 'bold' }}>{card.brand.toUpperCase()} PREMIUM</span>
                              <button className="btn btn-sm text-danger border-0 bg-transparent p-0" onClick={() => handleDeleteCard(card.id)}>
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                            <div className="h4 font-monospace my-3 text-white" style={{ letterSpacing: '4px' }}>{card.number}</div>
                            <div className="d-flex justify-content-between align-items-end">
                              <div>
                                <span className="text-secondary d-block font-monospace" style={{ fontSize: '9px' }}>CARD HOLDER</span>
                                <span className="text-white-50 small uppercase font-monospace">{card.holder}</span>
                              </div>
                              <div>
                                <span className="text-secondary d-block font-monospace" style={{ fontSize: '9px' }}>EXPIRY</span>
                                <span className="text-white-50 small font-monospace">{card.expiry}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Addition Form */}
                    <div className="col-lg-6">
                      <form onSubmit={handleAddCard} className="p-3 border border-secondary border-opacity-10 rounded">
                        <h5 className="text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Add Secure Payment Card</h5>
                        
                        <div className="mb-3">
                          <label className="form-label text-muted small">Card Number</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="1234 5678 1234 5678" 
                            maxLength="19"
                            value={newCardNumber}
                            onChange={(e) => setNewCardNumber(e.target.value)}
                          />
                        </div>

                        <div className="row g-3 mb-3">
                          <div className="col-6">
                            <label className="form-label text-muted small">Expiry Date</label>
                            <input 
                              type="text" 
                              className="form-control form-control-dark" 
                              placeholder="MM/YY" 
                              maxLength="5"
                              value={newCardExpiry}
                              onChange={(e) => setNewCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label text-muted small">Card Brand</label>
                            <select className="form-select form-control form-control-dark" value={newCardBrand} onChange={(e) => setNewCardBrand(e.target.value)}>
                              <option>Visa</option>
                              <option>MasterCard</option>
                              <option>Amex</option>
                              <option>RuPay</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label text-muted small">Cardholder Name</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="Full Name" 
                            value={newCardHolder}
                            onChange={(e) => setNewCardHolder(e.target.value)}
                          />
                        </div>

                        <button type="submit" className="btn btn-outline-gold w-100 mt-2">Vault Secure Card</button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* 5.3 UPI registry & Net banking & Gift card redeem */}
                <div className="row g-4">
                  {/* UPI registry */}
                  <div className="col-md-6">
                    <div className="premium-card h-100">
                      <div className="card-header-luxury">
                        <h3 className="card-title-luxury"><i className="fa-solid fa-mobile-screen-button text-warning"></i> Saved UPI Addresses</h3>
                      </div>
                      <ul className="list-group list-group-flush mb-4 bg-transparent">
                        {paymentDetails.upiIds.map((upi, index) => (
                          <li className="list-group-item bg-transparent text-white-50 border-secondary border-opacity-10 px-0 d-flex justify-content-between align-items-center" key={index}>
                            <span className="font-monospace text-light">{upi}</span>
                            <span className="badge bg-dark border border-secondary border-opacity-30 text-warning" style={{ fontSize: '10px' }}>Linked</span>
                          </li>
                        ))}
                      </ul>
                      <form onSubmit={handleAddUpi} className="d-flex gap-2">
                        <input 
                          type="text" 
                          className="form-control form-control-dark" 
                          placeholder="member@okupi" 
                          value={newUpiId}
                          onChange={(e) => setNewUpiId(e.target.value)}
                        />
                        <button type="submit" className="btn btn-sm btn-gold">Add UPI</button>
                      </form>
                    </div>
                  </div>

                  {/* Gift Card Redeem */}
                  <div className="col-md-6">
                    <div className="premium-card h-100">
                      <div className="card-header-luxury">
                        <h3 className="card-title-luxury"><i className="fa-solid fa-gift text-warning"></i> Redeem Gift Codes</h3>
                      </div>
                      <p className="text-muted small">Enter your exclusive curatorial gift voucher code to claim immediate treasury credits.</p>
                      
                      <form onSubmit={handleRedeemGift} className="d-flex gap-2 mt-4">
                        <input 
                          type="text" 
                          className="form-control form-control-dark" 
                          placeholder="VOUCHER-GOLD-88" 
                          value={giftCode}
                          onChange={(e) => setGiftCode(e.target.value)}
                        />
                        <button type="submit" className="btn btn-gold">Redeem Code</button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 6. VIP REWARDS & TICKETS TAB */}
            {activeTab === 'rewards' && (
              <section>
                {/* 6.1 Referral Guild */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-users text-warning"></i> Referral Ambassador Guild</h3>
                  </div>
                  <div className="row g-4 align-items-center">
                    <div className="col-md-7">
                      <p className="text-muted small">
                        Share the Aurelian legacy. For each premium client you refer who logs an order, both of you will receive ₹500 in secure treasury wallet funds.
                      </p>
                      <div className="d-flex align-items-center gap-3 mt-4">
                        <div>
                          <span className="text-secondary small d-block">YOUR REFERRAL KEY</span>
                          <span className="badge bg-dark border border-warning text-warning px-4 py-2 font-monospace" style={{ fontSize: '15px', letterSpacing: '2px' }}>
                            AUR-REF-{currentUser.name.toUpperCase().slice(0,4)}-{currentUser.id.slice(0,3)}
                          </span>
                        </div>
                        <button className="btn btn-outline-gold mt-3" onClick={handleReferFriend}>
                          Simulate Refer Sign-up
                        </button>
                      </div>
                    </div>
                    <div className="col-md-5 border-start border-secondary border-opacity-10 ps-md-4">
                      <div className="text-center p-3 rounded" style={{ background: '#0a0a0d' }}>
                        <span className="text-muted d-block small">Referral Wallet Dividends</span>
                        <h2 className="text-warning fw-bold my-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>₹{referralEarnings.toLocaleString()}</h2>
                        <span className="text-white-50 small d-block">{referralList.length} Qualified Members Invited</span>
                        <div className="text-muted mt-2" style={{ fontSize: '10px' }}>
                          Invited: {referralList.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6.2 Customer Support Tickets */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-headset text-warning"></i> Concierge Support Tickets</h3>
                  </div>

                  <div className="row g-4">
                    {/* Active Tickets List */}
                    <div className="col-lg-6">
                      <h5 className="text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Active Support Inquiries</h5>
                      {supportTickets.length === 0 ? (
                        <p className="text-muted small">No pending support logs registered.</p>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {supportTickets.map((tkt) => (
                            <div className="p-3 border border-secondary border-opacity-10 rounded bg-black" key={tkt.id}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong className="text-white">{tkt.subject}</strong>
                                <span className={`badge ${tkt.status === 'Resolved' ? 'bg-success text-dark' : 'bg-warning text-dark'}`} style={{ fontSize: '10px' }}>
                                  {tkt.status}
                                </span>
                              </div>
                              <p className="text-muted small mb-2">"{tkt.message}"</p>
                              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '11px' }}>
                                <span className="text-warning font-monospace">{tkt.id}</span>
                                <span className="text-secondary">{tkt.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* New Ticket Form */}
                    <div className="col-lg-6">
                      <form onSubmit={handleCreateTicket} className="p-3 border border-secondary border-opacity-10 rounded">
                        <h5 className="text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Initiate New Concierge Request</h5>
                        
                        <div className="mb-3">
                          <label className="form-label text-muted small">Subject / Product ID</label>
                          <input 
                            type="text" 
                            className="form-control form-control-dark" 
                            placeholder="e.g. Delivery status on Order..." 
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label text-muted small">Detailed Message</label>
                          <textarea 
                            className="form-control form-control-dark" 
                            rows="3" 
                            placeholder="Provide details about your query..." 
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        <button type="submit" className="btn btn-gold w-100">Dispatch Support Ticket</button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* 6.3 Reviews list */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-regular fa-star text-warning"></i> My Products Feedbacks & Ratings</h3>
                  </div>
                  <p className="text-muted small">You haven't submitted any public curation product reviews yet. Reviews can be posted directly from specific product showcase sheets.</p>
                </div>
              </section>
            )}

            {/* 7. PREFERENCES & SECURITY TAB */}
            {activeTab === 'settings' && (
              <section>
                {/* 7.1 Preferences */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-sliders text-warning"></i> Client Preferences</h3>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-warning small uppercase">Concierge Language</label>
                      <select className="form-select form-control form-control-dark">
                        <option>English (United Kingdom)</option>
                        <option>Hindi (India)</option>
                        <option>Spanish (Castilian)</option>
                        <option>French (Royal)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-warning small uppercase">Interactive Design Scheme</label>
                      <div className="d-flex align-items-center justify-content-between p-3 border border-secondary border-opacity-10 rounded mt-1">
                        <div>
                          <strong className="text-white small d-block">Onyx Dark Gold Mode</strong>
                          <span className="text-muted small">Standard brand design system</span>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" defaultChecked disabled style={{ cursor: 'not-allowed' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7.2 Two Factor Auth */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-shield-halved text-warning"></i> Registry Two-Factor Authentication (2FA)</h3>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <div>
                      <p className="text-muted small mb-0">
                        Add an extra layer of protection to your private vault by requiring a secure authentication passcode upon each login cycle.
                      </p>
                    </div>
                    <div>
                      <button className="btn btn-outline-gold px-4" onClick={() => triggerNotification('Two-Factor Authentication configuration initiated. Passcodes dispatched to your phone key.', 'info', '2FA Vault')}>
                        Configure 2FA Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* 7.3 Active Devices Session list */}
                <div className="premium-card">
                  <div className="card-header-luxury">
                    <h3 className="card-title-luxury"><i className="fa-solid fa-laptop-code text-warning"></i> Active Vault Sessions</h3>
                  </div>
                  <p className="text-muted small">Monitor all active devices carrying authorization access to your curatorial portfolio.</p>
                  
                  <div className="table-responsive mt-3">
                    <table className="table-luxury">
                      <thead>
                        <tr>
                          <th>Hardware / Client Device</th>
                          <th>Access IP Location</th>
                          <th>Timestamp</th>
                          <th className="text-end">Session Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong className="text-white">Windows PC (Chrome Browser)</strong>
                            <span className="text-muted d-block" style={{ fontSize: '11px' }}>Current active session</span>
                          </td>
                          <td className="font-monospace text-light">192.168.1.18 (Mumbai)</td>
                          <td className="text-white-50">Just now</td>
                          <td className="text-end">
                            <span className="badge bg-success text-dark py-1 px-3">ACTIVE</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong className="text-white">Apple iPhone 15 Pro (Safari App)</strong>
                            <span className="text-muted d-block" style={{ fontSize: '11px' }}>Mobile application</span>
                          </td>
                          <td className="font-monospace text-light">103.44.88.92 (New Delhi)</td>
                          <td className="text-white-50">May 21, 2026</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-danger py-1 px-3 text-danger border border-danger border-opacity-30" style={{ background: 'transparent' }} onClick={() => triggerNotification('Mobile device access revoked.', 'info', 'Session Terminated')}>
                              Revoke
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SHARED VAULT FOOTER */}
            <footer className="mt-5 pt-5 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <span className="text-muted small">© 2026 Aurelian Premium Curation. Locked & Secured.</span>
              <div className="d-flex gap-3">
                <Link to="/terms" className="text-muted small hover-gold">Terms</Link>
                <Link to="/about" className="text-muted small hover-gold">Privacy</Link>
              </div>
            </footer>

          </main>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
