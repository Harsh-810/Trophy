import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const triggerNotification = (message, type = 'success', title = '') => {
    const id = String(Date.now() + Math.random());
    const newNotif = {
      id,
      message,
      type,
      title: title || (type === 'error' ? 'Operation Halted' : 'Success Curation'),
      timestamp: new Date()
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Cleanup timer
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ triggerNotification }}>
      {children}
      <UnifiedToastContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

const UnifiedToastContainer = ({ notifications }) => {
  return (
    <>
      <style>{`
        /* --- GLOBAL ANIMATIONS --- */
        @keyframes toastify-slide-in {
          0% { transform: translateX(110%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes shrink-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }

        /* --- REACT TOASTIFY ENGINE (Top Right) --- */
        .aurelian-toastify-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 340px;
          pointer-events: none;
        }
        .aurelian-toastify {
          background: #111112;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-left: 5px solid #d4af37;
          color: #f5f1e8;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          pointer-events: auto;
          animation: toastify-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .aurelian-toastify.error {
          border-left-color: #ff4d4f;
        }
        .aurelian-toastify.info {
          border-left-color: #3b82f6;
        }
        .aurelian-toastify-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .aurelian-toastify-body {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }
        .aurelian-toastify-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #c9a227, #f1d255);
          animation: shrink-progress 4s linear forwards;
        }
        .aurelian-toastify-progress.error {
          background: #ff4d4f;
        }
        .aurelian-toastify-progress.info {
          background: #3b82f6;
        }
      `}</style>

      {notifications.length > 0 && (
        <div className="aurelian-toastify-container">
          {notifications.map((n) => (
            <div key={n.id} className={`aurelian-toastify ${n.type}`}>
              <div className="aurelian-toastify-header">
                <i className={`fa-solid ${n.type === 'error' ? 'fa-circle-exclamation text-danger' : n.type === 'info' ? 'fa-circle-info text-primary' : 'fa-circle-check text-warning'}`}></i>
                <span>{n.title}</span>
              </div>
              <div className="aurelian-toastify-body">{n.message}</div>
              <div className={`aurelian-toastify-progress ${n.type}`} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
