import React, { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Notifications = ({ currentUser, notifications = [], onMarkAsRead }) => {
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Ensure readNotifications is an array
  const readIds = currentUser.readNotifications || [];

  // Sort notifications by date (newest first)
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [notifications]);

  // Calculate unread count to show the button conditionally
  const unreadCount = sortedNotifications.filter(n => !readIds.includes(n.id)).length;

  const handleMarkAll = () => {
    // Collect all notification IDs
    const allIds = sortedNotifications.map(n => n.id);
    onMarkAsRead(allIds);
  };

  return (
    <>
      <style>{`
        #notifications-page {
          background: #000000;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          min-height: 80vh;
          padding: 120px 0 60px;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 20px;
        }

        .notif-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          color: #e4c24b;
          margin: 0;
          font-weight: 600;
        }

        .mark-read-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s;
          cursor: pointer;
        }

        .mark-read-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.3);
        }

        .mark-read-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notif-card {
          background: #0e0f12;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          margin-bottom: 16px;
          display: flex;
          gap: 20px;
          transition: 0.3s;
          position: relative;
        }

        .notif-card.unread {
          border-left: 4px solid #e4c24b;
          background: #111214;
        }

        .notif-icon {
          width: 50px;
          height: 50px;
          background: rgba(228,194,75,0.1);
          color: #e4c24b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
        }

        .notif-header-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .notif-subject {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #fff;
        }

        .notif-time {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        .notif-desc {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #0e0f12;
          border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>

      <div id="notifications-page">
        <div className="container-xxl">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              
              <div className="notif-header">
                <div>
                  <h1 className="notif-title">Notifications</h1>
                  <p className="text-white-50 mt-2 mb-0">Stay updated with the latest announcements, schemes, and exclusive coupons.</p>
                </div>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={handleMarkAll}>
                    <i className="fa-solid fa-check-double me-2"></i> Mark All as Read
                  </button>
                )}
              </div>

              {sortedNotifications.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-regular fa-bell-slash fa-3x text-white-50 mb-3"></i>
                  <h4 className="text-white">No notifications yet</h4>
                  <p className="text-white-50">When we have news, it will appear here.</p>
                </div>
              ) : (
                <div className="notif-list">
                  {sortedNotifications.map(notif => {
                    const isUnread = !readIds.includes(notif.id);
                    return (
                      <div key={notif.id} className={`notif-card ${isUnread ? 'unread' : ''}`}>
                        {isUnread && (
                          <div style={{position: 'absolute', top: '24px', right: '24px', width: '8px', height: '8px', background: '#e4c24b', borderRadius: '50%'}}></div>
                        )}
                        <div className="notif-icon">
                          {notif.type === 'coupon' ? <i className="fa-solid fa-ticket"></i> : <i className="fa-solid fa-bullhorn"></i>}
                        </div>
                        <div className="notif-content">
                          <div className="notif-header-text">
                            <h3 className="notif-subject">{notif.title}</h3>
                            <span className="notif-time">{new Date(notif.date).toLocaleDateString()}</span>
                          </div>
                          <p className="notif-desc">{notif.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
