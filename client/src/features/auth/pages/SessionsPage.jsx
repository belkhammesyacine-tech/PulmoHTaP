// features/auth/pages/SessionsPage.jsx
import { useState, useEffect } from 'react';
import { authApi } from '../api/auth.api.js';
import DashboardNav from '../../../core/components/DashboardNav.jsx';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  const loadSessions = () => {
    setLoading(true);
    authApi.getSessions()
      .then(({ data }) => setSessions(data.sessions || []))
      .catch(() => setMsg('فشل في جلب الجلسات'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSessions(); }, []);

  const revokeSession = async (id) => {
    try {
      await authApi.revokeSession(id);
      loadSessions();
    } catch {
      alert('فشل إنهاء الجلسة');
    }
  };

  const revokeAllOther = async () => {
    try {
      await authApi.revokeAll();
      loadSessions();
    } catch {
      alert('فشل إنهاء الجلسات الأجهزة الأخرى');
    }
  };

  return (
    <div className="dashboard">
      <DashboardNav backTo="/dashboard" backLabel="العودة للوحة التحكم" />

      <main className="dashboard-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 className="card-title" style={{ margin: 0, padding: 0, borderBottom: 'none' }}>الأجهزة والجلسات النشطة</h1>
            <button onClick={revokeAllOther} className="btn btn-primary" style={{ background: 'var(--color-danger)', fontSize: 13, width: 'auto' }}>
              إنهاء جميع الجلسات الأخرى
            </button>
          </div>

          {loading ? (
            <div>جاري التحميل...</div>
          ) : sessions.length === 0 ? (
            <p>لا توجد جلسات نشطة أخرى</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sessions.map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.deviceInfo || 'جهاز غير معروف'}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      IP: {s.ipAddress || 'غير محدد'} | آخر استخدام: {new Date(s.lastUsedAt).toLocaleString('ar-DZ')}
                    </div>
                  </div>
                  <button onClick={() => revokeSession(s.id)} className="btn-link" style={{ color: 'var(--color-danger)' }}>
                    إنهاء
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
