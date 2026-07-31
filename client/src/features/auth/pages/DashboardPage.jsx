// features/auth/pages/DashboardPage.jsx
import { useAuth } from '../../../core/context/AuthContext.jsx';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import { ACCOUNT_TYPE_LABELS } from '../../../core/constants/accountTypes.js';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <DashboardNav />

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

          <div className="info-grid">
            <div className="info-grid__item">
              <div className="info-grid__label">البريد الإلكتروني</div>
              <div className="info-grid__value">{user?.email}</div>
            </div>
            <div className="info-grid__item">
              <div className="info-grid__label">رقم الهاتف</div>
              <div className="info-grid__value" style={{ direction: 'ltr', textAlign: 'right' }}>{user?.phone}</div>
            </div>
            <div className="info-grid__item">
              <div className="info-grid__label">حالة الحساب</div>
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
