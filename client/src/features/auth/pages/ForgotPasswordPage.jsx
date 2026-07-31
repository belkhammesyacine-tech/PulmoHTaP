// features/auth/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import AuthHero from '../../../core/components/AuthHero.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch {
      setError('حدث خطأ، يُرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHero icon="🔑" title="استعادة كلمة المرور" subtitle="سنرسل لك رابطاً آمناً لإعادة تعيين كلمة مرورك" />
      <div className="auth-form-side">
        <div className="auth-card">
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
              <h2 className="auth-card__title">تم الإرسال!</h2>
              <p className="auth-card__subtitle">
                إذا كان البريد <strong>{email}</strong> مسجلاً، ستتلقى رابطاً خلال دقائق.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: 20 }}>
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h1 className="auth-card__title">نسيت كلمة المرور؟</h1>
              <p className="auth-card__subtitle">أدخل بريدك الإلكتروني المسجّل وسنرسل لك رابط الاستعادة</p>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
                  <input id="email" type="email" className="form-input"
                    placeholder="example@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required autoFocus />
                </div>
                <button id="btn-forgot" type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><div className="spinner" /> جاري الإرسال...</> : 'إرسال رابط الاستعادة'}
                </button>
              </form>
              <div className="auth-footer">
                <Link to="/login" className="btn-link">← العودة لتسجيل الدخول</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
