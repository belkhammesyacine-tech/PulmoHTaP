// core/components/NotificationBell.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';

const TYPE_ICON = { SUCCESS: '✅', WARNING: '⚠️', DANGER: '❌', INFO: 'ℹ️' };

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open,        setOpen]        = useState(false);
  const [notifs,      setNotifs]      = useState([]);
  const [unread,      setUnread]      = useState(0);
  const [loading,     setLoading]     = useState(false);
  const panelRef = useRef(null);

  const fetch = useCallback(async () => {
    try {
      const res = await client.get('/notifications');
      setNotifs(res.data.notifications);
      setUnread(res.data.unreadCount);
    } catch { /* silent */ }
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, [fetch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      try {
        await client.patch('/notifications/read-all');
        setUnread(0);
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch { /* silent */ }
    }
  };

  const handleClick = (n) => {
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        id="btn-notifications"
        onClick={handleOpen}
        className="theme-toggle"
        title="الإشعارات"
        style={{ position: 'relative' }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, left: 2,
            background: 'var(--color-danger)',
            color: '#fff', borderRadius: '99px',
            fontSize: 9, fontWeight: 700,
            minWidth: 16, height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: 0,
          width: 320,
          maxHeight: 420,
          overflowY: 'auto',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevated)',
          zIndex: 200,
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <strong style={{ fontSize: 14 }}>الإشعارات</strong>
            {notifs.length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {notifs.filter(n => !n.isRead).length > 0
                  ? `${notifs.filter(n => !n.isRead).length} غير مقروء`
                  : 'كل شيء مقروء'}
              </span>
            )}
          </div>

          {notifs.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              لا توجد إشعارات
            </div>
          ) : (
            notifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--color-border-muted)',
                  cursor: n.link ? 'pointer' : 'default',
                  background: n.isRead ? 'transparent' : 'var(--color-primary-light)',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = n.isRead ? 'transparent' : 'var(--color-primary-light)'; }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{TYPE_ICON[n.type] || 'ℹ️'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{n.body}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginTop: 4 }}>
                      {new Date(n.createdAt).toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
