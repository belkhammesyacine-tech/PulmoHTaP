// features/auth/pages/ResetPasswordPage.jsx
import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import AuthHero from '../../../core/components/AuthHero.jsx';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('رمز الاستعادة مفقود من الرابط');
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل وتتضمن حرفاً كبيراً ورقماً');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error ?? 'حدث خطأ أو انتهت صلاحية الرابط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHero icon="🔒" title="تعيين كلمة مرور جديدة" subtitle="أدخل كلمة مرور قوية لحماية حسابك" />
      <div className="auth-form-side">
        <div className="auth-card">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 className="auth-card__title">تم تغيير كلمة المرور</h2>
              <p className="auth-card__subtitle">يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: 20 }}>
                تسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h1 className="auth-card__title">إعادة تعيين كلمة المرور</h1>
              <p className="auth-card__subtitle">أدخل كلمة المرور الجديدة أدناه</p>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">كلمة المرور الجديدة</label>
                  <input id="password" type="password" className="form-input"
                    placeholder="8 أحرف، حرف كبير ورقم" value={password}
                    onChange={(e) => setPassword(e.target.value)} required autoFocus />
                </div>
                <button id="btn-reset" type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><div className="spinner" /> جاري التعيين...</> : 'تأكيد كلمة المرور'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
