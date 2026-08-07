// features/admin/pages/AdminDashboardPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../core/context/AuthContext.jsx';
<<<<<<< HEAD
import { useLang } from '../../../core/context/LanguageContext.jsx';
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: 'var(--shadow-card)',
      borderRight: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color }}>{value ?? '—'}</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
<<<<<<< HEAD
  const { t } = useLang();
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
  const [verifications, setVerifications] = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [statsLoading,  setStatsLoading]  = useState(true);
  const [error,         setError]         = useState(null);

  const fetchVerifications = async () => {
    try {
      const res = await client.get('/admin/verifications/pending');
      setVerifications(res.data.verifications);
    } catch (err) {
<<<<<<< HEAD
      setError(t('admin_dashboard.err_fetch_verifications'));
=======
      setError('فشل في جلب الطلبات');
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await client.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
    fetchStats();
  }, []);

  const handleReview = async (id, status) => {
    let rejectionReason = '';
    if (status === 'REJECTED') {
<<<<<<< HEAD
      rejectionReason = window.prompt(t('admin_dashboard.prompt_reject_reason'));
=======
      rejectionReason = window.prompt('سبب الرفض:');
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
      if (rejectionReason === null) return;
    }
    try {
      await client.put(`/admin/verifications/${id}/review`, { status, rejectionReason });
      setVerifications(prev => prev.filter(v => v.id !== id));
      if (status === 'VERIFIED') {
        setStats(s => s ? { ...s, pendingVerifications: s.pendingVerifications - 1 } : s);
      }
    } catch (err) {
<<<<<<< HEAD
      alert(err.response?.data?.error || t('admin_dashboard.err_submit'));
=======
      alert(err.response?.data?.error || 'حدث خطأ');
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
    }
  };

  if (!user || (user.accountType !== 'PLATFORM_ADMIN' && user.accountType !== 'CLINIC_ADMIN')) {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
<<<<<<< HEAD
          <div className="alert alert-error">{t('admin_dashboard.err_unauthorized')}</div>
=======
          <div className="alert alert-error">صلاحيات غير كافية للوصول إلى لوحة الإدارة.</div>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">

        {/* Stats Section */}
        <div className="card" style={{ marginBottom: 24 }}>
<<<<<<< HEAD
          <h1 className="card-title">{t('admin_dashboard.stats_title')}</h1>
=======
          <h1 className="card-title">📊 إحصاءات المنصة</h1>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
          {statsLoading ? (
            <div className="spinner" style={{ margin: '20px auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488', width: 24, height: 24 }} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 8 }}>
<<<<<<< HEAD
              <StatCard icon="👥" label={t('admin_dashboard.total_users')} value={stats?.totalUsers}        color="#0d9488" />
              <StatCard icon="🤒" label={t('admin_dashboard.total_patients')}                    value={stats?.totalPatients}     color="#2563eb" />
              <StatCard icon="🩺" label={t('admin_dashboard.total_doctors')}         value={stats?.totalDoctors}      color="#7c3aed" />
              <StatCard icon="📅" label={t('admin_dashboard.total_appointments')}           value={stats?.totalAppointments} color="#d97706" />
              <StatCard icon="⏳" label={t('admin_dashboard.pending_appointments')}       value={stats?.pendingAppointments} color="#f59e0b" />
              <StatCard icon="📋" label={t('admin_dashboard.total_records')}            value={stats?.totalRecords}      color="#059669" />
              <StatCard icon="🔔" label={t('admin_dashboard.pending_verifications_count')}         value={stats?.pendingVerifications} color="#dc2626" />
=======
              <StatCard icon="👥" label="إجمالي المستخدمين النشطين" value={stats?.totalUsers}        color="#0d9488" />
              <StatCard icon="🤒" label="المرضى"                    value={stats?.totalPatients}     color="#2563eb" />
              <StatCard icon="🩺" label="الأطباء والمختصون"         value={stats?.totalDoctors}      color="#7c3aed" />
              <StatCard icon="📅" label="إجمالي المواعيد"           value={stats?.totalAppointments} color="#d97706" />
              <StatCard icon="⏳" label="مواعيد قيد الانتظار"       value={stats?.pendingAppointments} color="#f59e0b" />
              <StatCard icon="📋" label="السجلات الطبية"            value={stats?.totalRecords}      color="#059669" />
              <StatCard icon="🔔" label="طلبات توثيق معلقة"         value={stats?.pendingVerifications} color="#dc2626" />
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
            </div>
          )}
        </div>

        {/* Verifications Section */}
        <div className="card">
<<<<<<< HEAD
          <h2 className="card-title">{t('admin_dashboard.verifications_title')}</h2>
=======
          <h2 className="card-title">🔖 طلبات توثيق الأطباء المعلقة</h2>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner" style={{ margin: '20px auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488', width: 24, height: 24 }} />
          ) : verifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
<<<<<<< HEAD
              <p>{t('admin_dashboard.no_pending_verifications')}</p>
=======
              <p>لا توجد طلبات معلقة حالياً.</p>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {verifications.map(v => (
                <div key={v.id} style={{ background: 'var(--color-surface-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
<<<<<<< HEAD
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{t('admin_dashboard.doctor_dr')} {v.user.fullName}</h3>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>{t('admin_dashboard.email')}</strong> {v.user.email} | <strong>{t('admin_dashboard.phone')}</strong> {v.user.phone}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>{t('admin_dashboard.license_no')}</strong> {v.licenseNumber} | <strong>{t('admin_dashboard.specialty')}</strong> {v.specialty || '-'}
                      </p>
                      <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>{t('admin_dashboard.institution')}</strong> {v.institution || '-'} | <strong>{t('admin_dashboard.wilaya')}</strong> {v.user.profile?.wilaya || '-'}
                      </p>
                      {v.documentUrl && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                          <a href={v.documentUrl} target="_blank" rel="noreferrer" className="btn-link">{t('admin_dashboard.view_document')}</a>
=======
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>د. {v.user.fullName}</h3>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>البريد:</strong> {v.user.email} | <strong>الهاتف:</strong> {v.user.phone}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>رقم الرخصة:</strong> {v.licenseNumber} | <strong>التخصص:</strong> {v.specialty || '-'}
                      </p>
                      <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        <strong>المؤسسة:</strong> {v.institution || '-'} | <strong>الولاية:</strong> {v.user.profile?.wilaya || '-'}
                      </p>
                      {v.documentUrl && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                          <a href={v.documentUrl} target="_blank" rel="noreferrer" className="btn-link">عرض الوثيقة المرفقة</a>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
<<<<<<< HEAD
                      <button onClick={() => handleReview(v.id, 'VERIFIED')} className="btn btn-sm" style={{ background: 'var(--color-success)', color: '#fff' }}>{t('admin_dashboard.btn_accept')}</button>
                      <button onClick={() => handleReview(v.id, 'REJECTED')} className="btn btn-sm" style={{ background: 'var(--color-danger)',  color: '#fff' }}>{t('admin_dashboard.btn_reject')}</button>
=======
                      <button onClick={() => handleReview(v.id, 'VERIFIED')} className="btn btn-sm" style={{ background: 'var(--color-success)', color: '#fff' }}>✓ قبول</button>
                      <button onClick={() => handleReview(v.id, 'REJECTED')} className="btn btn-sm" style={{ background: 'var(--color-danger)',  color: '#fff' }}>✕ رفض</button>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
