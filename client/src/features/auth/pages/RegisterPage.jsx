// features/auth/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import AuthHero from '../../../core/components/AuthHero.jsx';
import { ACCOUNT_TYPES } from '../../../core/constants/accountTypes.js';

export default function RegisterPage() {
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
    if (!form.fullName || form.fullName.length < 3) errs.fullName = 'الاسم الكامل مطلوب (3 أحرف على الأقل)';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'بريد إلكتروني غير صحيح';
    if (!form.phone || !/^(\+213|0)(5|6|7)\d{8}$/.test(form.phone)) errs.phone = 'رقم الهاتف الجزائري غير صحيح (مثال: 0555123456)';
    if (!form.password || form.password.length < 8) errs.password = 'كلمة المرور 8 أحرف على الأقل';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'يجب أن تحتوي على حرف كبير';
    else if (!/[0-9]/.test(form.password)) errs.password = 'يجب أن تحتوي على رقم';
    if (!form.accountType) errs.accountType = 'يُرجى اختيار نوع الحساب';
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
      sessionStorage.setItem('registerEmail', form.email);
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.error ?? 'حدث خطأ، يُرجى المحاولة لاحقاً');
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
            <h2 className="auth-card__title">تحقق من بريدك الإلكتروني</h2>
            <p className="auth-card__subtitle" style={{ marginBottom: 24 }}>
              أرسلنا رابط تفعيل إلى <strong>{form.email}</strong>. يُرجى الضغط عليه خلال 24 ساعة.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                العودة لتسجيل الدخول
              </Link>
              <button className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto' }} onClick={async () => {
                try {
                  await authApi.resendVerification({ email: form.email });
                  alert('تم الإرسال مجدداً بنجاح بناءً على طلبك.');
                } catch {
                  alert('حدث خطأ، حاول مجدداً لاحقاً.');
                }
              }}>لم تستلم البريد؟ أعد الإرسال</button>
            </div>
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
          <h1 className="auth-card__title">إنشاء حساب جديد</h1>
          <p className="auth-card__subtitle">انضم إلى منصة PulmoHTapAlgérie</p>

          {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

          <form onSubmit={onSubmit} noValidate>
            <Field label="الاسم الكامل" id="fullName" name="fullName" type="text"
              placeholder="أحمد بن علي" value={form.fullName} onChange={onChange} error={errors.fullName} autoFocus />

            <Field label="البريد الإلكتروني" id="email" name="email" type="email"
              placeholder="example@email.com" value={form.email} onChange={onChange} error={errors.email} />

            <Field label="رقم الهاتف" id="phone" name="phone" type="tel"
              placeholder="0555123456" value={form.phone} onChange={onChange} error={errors.phone} />

            <Field label="كلمة المرور" id="password" name="password" type="password"
              placeholder="8 أحرف، حرف كبير ورقم" value={form.password} onChange={onChange} error={errors.password} />

            <div className="form-group">
              <label className="form-label" htmlFor="accountType">نوع الحساب</label>
              <select id="accountType" name="accountType" className={`form-input form-select${errors.accountType ? ' error' : ''}`}
                value={form.accountType} onChange={onChange}>
                <option value="">-- اختر نوع حسابك --</option>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </select>
              {errors.accountType && <p className="form-error">⚠️ {errors.accountType}</p>}
            </div>

            <button id="btn-register" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" /> جاري الإنشاء...</> : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="auth-footer">
            لديك حساب؟ <Link to="/login" className="btn-link">سجّل دخولك</Link>
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

