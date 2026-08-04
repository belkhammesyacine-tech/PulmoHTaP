// features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import AuthHero from '../../../core/components/AuthHero.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorCode('');
    setResendStatus('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error ?? 'حدث خطأ، يُرجى المحاولة لاحقاً');
      setErrorCode(err.response?.data?.code ?? '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHero />
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-card__title">مرحباً بعودتك 👋</h1>
          <p className="auth-card__subtitle">سجّل دخولك للوصول إلى منصة PulmoHTapAlgérie</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              ⚠️ {error}
              {errorCode === 'ACCOUNT_PENDING' && (
                <div style={{ marginTop: 10 }}>
                  <button type="button" className="btn-link" onClick={async () => {
                    try {
                      setResendStatus('جاري الإرسال...');
                      const { authApi } = await import('../api/auth.api.js');
                      await authApi.resendVerification({ email: form.email });
                      setResendStatus('تم إرسال الرابط! تحقق من بريدك.');
                    } catch {
                      setResendStatus('حدث خطأ أثناء الإرسال.');
                    }
                  }}>
                    {resendStatus || 'إعادة إرسال رابط التفعيل'}
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
              <input id="email" name="email" type="email" className="form-input"
                placeholder="example@email.com" value={form.email}
                onChange={onChange} required autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">كلمة المرور</label>
              <input id="password" name="password" type="password" className="form-input"
                placeholder="••••••••" value={form.password}
                onChange={onChange} required />
            </div>

            <div style={{ textAlign: 'left', marginBottom: 20 }}>
              <Link to="/forgot-password" className="btn-link">نسيت كلمة المرور؟</Link>
            </div>

            <button id="btn-login" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" /> جاري التحقق...</> : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="auth-footer">
            ليس لديك حساب؟ <Link to="/register" className="btn-link">أنشئ حساباً</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

