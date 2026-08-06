// features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import { useLang } from '../../../core/context/LanguageContext.jsx';
import AuthHero from '../../../core/components/AuthHero.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error ?? t('auth.login_error_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHero />
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-card__title">{t('auth.login_title')}</h1>
          <p className="auth-card__subtitle">{t('auth.login_subtitle')}</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">{t('auth.email')}</label>
              <input id="email" name="email" type="email" className="form-input"
                placeholder="example@email.com" value={form.email}
                onChange={onChange} required autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{t('auth.password')}</label>
              <input id="password" name="password" type="password" className="form-input"
                placeholder="••••••••" value={form.password}
                onChange={onChange} required />
            </div>

            <div style={{ textAlign: 'start', marginBottom: 20 }}>
              <Link to="/forgot-password" className="btn-link">{t('auth.forgot_password')}</Link>
            </div>

            <button id="btn-login" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" /> {t('auth.verifying')}</> : t('auth.login_btn')}
            </button>
          </form>

          <div className="auth-footer">
            {t('auth.no_account')} <Link to="/register" className="btn-link">{t('auth.register_btn')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

