// features/users/pages/DoctorVerificationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import { useLang } from '../../../core/context/LanguageContext.jsx';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

export default function DoctorVerificationPage() {
  const { user } = useAuth();
  const { t } = useLang();
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

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.accountType !== 'DOCTOR' && user.accountType !== 'SPECIALIST')) {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
          <div className="alert alert-error">{t('doctor_verification.err_only_doctors')}</div>
        </main>
      </div>
    );
  }

  if (user.doctorVerification?.status === 'VERIFIED') {
    return (
      <div className="dashboard">
        <DashboardNav />
        <main className="dashboard-content">
          <div className="alert alert-success">{t('doctor_verification.already_verified')}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        <div className="card">
          <h1 className="card-title">{t('doctor_verification.title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            {t('doctor_verification.subtitle')}
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="licenseNumber">{t('doctor_verification.license_number')} *</label>
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
              <label className="form-label" htmlFor="specialty">{t('doctor_verification.specialty')}</label>
              <input
                id="specialty"
                type="text"
                className="form-input"
                value={formData.specialty}
                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institution">{t('doctor_verification.institution')}</label>
              <input
                id="institution"
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>

            <div className="form-group">
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
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
