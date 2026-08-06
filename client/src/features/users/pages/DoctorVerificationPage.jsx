// features/users/pages/DoctorVerificationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

export default function DoctorVerificationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialty: '',
    institution: '',
    documentUrl: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await client.post('/users/me/verification', formData);
      setSuccess(res.data.message);
      setTimeout(() => {
        // Hard reload or context reload is better, but this will do for MVP
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الإرسال');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.accountType !== 'DOCTOR' && user.accountType !== 'SPECIALIST')) {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
          <div className="alert alert-error">هذه الصفحة مخصصة للأطباء والمختصين فقط.</div>
        </main>
      </div>
    );
  }

  if (user.doctorVerification?.status === 'VERIFIED') {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
          <div className="alert alert-success">حسابك موثق بالفعل.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        <div className="card">
          <h1 className="card-title">توثيق الحساب الطبي</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            الرجاء تقديم المعلومات المهنية الخاصة بك للتحقق من هويتك الطبية ومنحك صلاحية الوصول لسجلات المرضى.
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="licenseNumber">رقم رخصة مزاولة المهنة *</label>
              <input
                id="licenseNumber"
                type="text"
                className="form-input"
                required
                value={formData.licenseNumber}
                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="specialty">التخصص (اختياري)</label>
              <input
                id="specialty"
                type="text"
                className="form-input"
                value={formData.specialty}
                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institution">المستشفى / العيادة (اختياري)</label>
              <input
                id="institution"
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="documentUrl">رابط للوثيقة أو البطاقة (اختياري)</label>
              <input
                id="documentUrl"
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.documentUrl}
                onChange={e => setFormData({ ...formData, documentUrl: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التوثيق'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
