// features/auth/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import { useLang } from '../../../core/context/LanguageContext.jsx';
import AuthHero from '../../../core/components/AuthHero.jsx';
import { ACCOUNT_TYPES } from '../../../core/constants/accountTypes.js';

export default function RegisterPage() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    accountType: searchParams.get('accountType') || '',
  });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName || form.fullName.length < 3) errs.fullName = t('auth.err_name');
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = t('auth.err_email');
    if (!form.phone || !/^(\+213|0)(5|6|7)\d{8}$/.test(form.phone)) errs.phone = t('auth.err_phone');
    if (!form.password || form.password.length < 8) errs.password = t('auth.err_pwd_len');
    else if (!/[A-Z]/.test(form.password)) errs.password = t('auth.err_pwd_upper');
    else if (!/[0-9]/.test(form.password)) errs.password = t('auth.err_pwd_num');
    if (!form.accountType) errs.accountType = t('auth.err_type');
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setApiError('');
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.error ?? t('auth.login_error_default'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <AuthHero />
      <div className="auth-form-side">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
          <h2 className="auth-card__title">{t('auth.check_email_title')}</h2>
          <p className="auth-card__subtitle" style={{ marginBottom: 24 }}>
            {t('auth.check_email_subtitle_1')} <strong>{form.email}</strong>. {t('auth.check_email_subtitle_2')}
          </p>
          <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
            {t('auth.back_to_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="auth-page">
    <AuthHero />
    <div className="auth-form-side">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('auth.register_title')}</h1>
        <p className="auth-card__subtitle">{t('auth.register_subtitle')}</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={onSubmit} noValidate>
          <Field label={t('auth.fullName')} id="fullName" name="fullName" type="text"
            placeholder="" value={form.fullName} onChange={onChange} error={errors.fullName} autoFocus />

          <Field label={t('auth.email')} id="email" name="email" type="email"
            placeholder="example@email.com" value={form.email} onChange={onChange} error={errors.email} />

          <Field label={t('auth.phone')} id="phone" name="phone" type="tel"
            placeholder="0555123456" value={form.phone} onChange={onChange} error={errors.phone} />

          <Field label={t('auth.password')} id="password" name="password" type="password"
            placeholder="" value={form.password} onChange={onChange} error={errors.password} />

          <div className="form-group">
            <label className="form-label" htmlFor="accountType">{t('auth.account_type')}</label>
            <select id="accountType" name="accountType" className={`form-input form-select${errors.accountType ? ' error' : ''}`}
              value={form.accountType} onChange={onChange}>
              <option value="">{t('auth.select_account')}</option>
              {ACCOUNT_TYPES.map((typeObj) => (
                <option key={typeObj.value} value={typeObj.value}>{typeObj.icon} {typeObj.label}</option>
              ))}
            </select>
            {errors.accountType && <p className="form-error">⚠️ {errors.accountType}</p>}
          </div>

          <button id="btn-register" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><div className="spinner" /> {t('auth.creating')}</> : t('auth.register_btn')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.has_account')} <Link to="/login" className="btn-link">{t('auth.login_btn')}</Link>
        </div>
      </div>
    </div>
  </div>
  );
}

function Field({ label, id, name, type, placeholder, value, onChange, error, autoFocus }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} className={`form-input${error ? ' error' : ''}`}
        placeholder={placeholder} value={value} onChange={onChange}
        autoFocus={autoFocus} required />
      {error && <p className="form-error">⚠️ {error}</p>}
    </div>
  );
}

