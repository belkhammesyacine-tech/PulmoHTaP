// features/users/pages/DoctorVerificationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
<<<<<<< HEAD
import { useLang } from '../../../core/context/LanguageContext.jsx';
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

export default function DoctorVerificationPage() {
  const { user } = useAuth();
<<<<<<< HEAD
  const { t } = useLang();
=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
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

<<<<<<< HEAD
  const [file, setFile] = useState(null);

=======
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
<<<<<<< HEAD
      let docUrl = formData.documentUrl;

      // Upload file first if provided
      if (file) {
        const data = new FormData();
        data.append('file', file);
        const uploadRes = await client.post('/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        docUrl = uploadRes.data.url;
      }

      const payload = { ...formData, documentUrl: docUrl };
      const res = await client.post('/users/me/verification', payload);
      setSuccess(res.data.message);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || t('doctor_verification.err_submit'));
=======
      const res = await client.post('/users/me/verification', formData);
      setSuccess(res.data.message);
      setTimeout(() => {
        // Hard reload or context reload is better, but this will do for MVP
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الإرسال');
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.accountType !== 'DOCTOR' && user.accountType !== 'SPECIALIST')) {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
<<<<<<< HEAD
          <div className="alert alert-error">{t('doctor_verification.err_only_doctors')}</div>
=======
          <div className="alert alert-error">هذه الصفحة مخصصة للأطباء والمختصين فقط.</div>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
        </main>
      </div>
    );
  }

  if (user.doctorVerification?.status === 'VERIFIED') {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
<<<<<<< HEAD
          <div className="alert alert-success">{t('doctor_verification.already_verified')}</div>
=======
          <div className="alert alert-success">حسابك موثق بالفعل.</div>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        <div className="card">
<<<<<<< HEAD
          <h1 className="card-title">{t('doctor_verification.title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            {t('doctor_verification.subtitle')}
=======
          <h1 className="card-title">توثيق الحساب الطبي</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            الرجاء تقديم المعلومات المهنية الخاصة بك للتحقق من هويتك الطبية ومنحك صلاحية الوصول لسجلات المرضى.
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
<<<<<<< HEAD
              <label className="form-label" htmlFor="licenseNumber">{t('doctor_verification.license_number')} *</label>
=======
              <label className="form-label" htmlFor="licenseNumber">رقم رخصة مزاولة المهنة *</label>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
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
<<<<<<< HEAD
              <label className="form-label" htmlFor="specialty">{t('doctor_verification.specialty')}</label>
=======
              <label className="form-label" htmlFor="specialty">التخصص (اختياري)</label>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
              <input
                id="specialty"
                type="text"
                className="form-input"
                value={formData.specialty}
                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              />
            </div>

            <div className="form-group">
<<<<<<< HEAD
              <label className="form-label" htmlFor="institution">{t('doctor_verification.institution')}</label>
=======
              <label className="form-label" htmlFor="institution">المستشفى / العيادة (اختياري)</label>
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
              <input
                id="institution"
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>

            <div className="form-group">
<<<<<<< HEAD
              <label className="form-label" htmlFor="documentUrl">{t('doctor_verification.document')} *</label>
              <input
                id="documentUrl"
                type="file"
                accept="image/*,application/pdf"
                className="form-input"
                onChange={e => setFile(e.target.files[0])}
                style={{ padding: '8px' }}
                required={!formData.documentUrl} // Require file if URL isn't already provided
              />
              {loading && file && <div style={{ fontSize: 12, color: 'var(--color-primary)', marginTop: 4 }}>{t('common.loading')}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('doctor_verification.sending') : t('doctor_verification.submit_btn')}
=======
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
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
