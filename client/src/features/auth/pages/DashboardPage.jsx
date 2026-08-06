// features/auth/pages/DashboardPage.jsx
import { useAuth } from '../../../core/context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import { ACCOUNT_TYPE_LABELS } from '../../../core/constants/accountTypes.js';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <DashboardNav />

      <main className="dashboard-content">
        {(user?.accountType === 'DOCTOR' || user?.accountType === 'SPECIALIST') && (!user?.doctorVerification || user.doctorVerification.status === 'UNVERIFIED' || user.doctorVerification.status === 'REJECTED') && (
          <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>تنبيه:</strong> حسابك كطبيب يحتاج إلى توثيق لكي تتمكن من الوصول لبيانات المرضى.
              {user?.doctorVerification?.status === 'REJECTED' && ` (سبب الرفض: ${user.doctorVerification.rejectionReason})`}
            </span>
            <Link to="/verify-doctor" className="btn btn-primary btn-sm" style={{ margin: 0 }}>
              توثيق الحساب
            </Link>
          </div>
        )}
        
        {(user?.accountType === 'DOCTOR' || user?.accountType === 'SPECIALIST') && user?.doctorVerification?.status === 'PENDING_REVIEW' && (
          <div className="alert alert-info">
            <strong>قيد المراجعة:</strong> طلب التوثيق الخاص بك قيد المراجعة من قبل الإدارة.
          </div>
        )}

        {user?.accountType === 'PLATFORM_ADMIN' && (
          <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>أنت مدير منصة. راجع طلبات توثيق الأطباء.</span>
            <Link to="/admin" className="btn btn-primary btn-sm" style={{ margin: 0 }}>لوحة الإدارة</Link>
          </div>
        )}

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
