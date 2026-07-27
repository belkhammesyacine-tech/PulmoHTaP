// features/auth/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';

const ACCOUNT_TYPE_LABELS = {
  PATIENT:        'مريض',
  DOCTOR:         'طبيب عام',
  SPECIALIST:     'طبيب مختص',
  LABORATORY:     'مخبر',
  PHARMACY:       'صيدلية',
  PSYCHOLOGIST:   'أخصائي نفسي',
  RESEARCHER:     'باحث',
  CLINIC_ADMIN:   'مسؤول مؤسسة صحية',
  PLATFORM_ADMIN: 'مدير المنصة',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span>🫁</span>
          <span>PulmoHTapAlgérie</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/profile" className="btn-link" style={{ fontSize: 14 }}>الملف الشخصي</Link>
          <Link to="/sessions" className="btn-link" style={{ fontSize: 14 }}>الجلسات النشطة</Link>
          <button onClick={logout} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13, width: 'auto' }}>
            تسجيل الخروج
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1 className="card-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
              مرحباً، {user?.fullName} 👋
            </h1>
            <span className="badge badge-primary">
              {ACCOUNT_TYPE_LABELS[user?.accountType] || user?.accountType}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20 }}>
            أهلاً بك في البنية التحتية الموحدة لمنصة PulmoHTapAlgérie. تم التحقق من هويتك بنجاح وجلستك آمنة.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>البريد الإلكتروني</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{user?.email}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>رقم الهاتف</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, direction: 'ltr', textAlign: 'right' }}>{user?.phone}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>حالة الحساب</div>
              <div style={{ marginTop: 4 }}>
                <span className={`badge ${user?.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                  {user?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">الخدمات والوحدات المتاحة</h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
            يمكن للأنظمة والوحدات القادمة (المتابعة الطبية، التشخيص الذكي، إدارة السجلات) الاعتماد على هويتك الحالية فورياً دون الحاجة لتسجيل إضافي.
          </p>
        </div>
      </main>
    </div>
  );
}
