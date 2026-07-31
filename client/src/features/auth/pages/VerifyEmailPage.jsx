// features/auth/pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import AuthHero from '../../../core/components/AuthHero.jsx';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus]   = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('رمز التحقق مفقود من الرابط');
      return;
    }

    authApi.verifyEmail(token)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message || 'تم تفعيل حسابك بنجاح!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'رابط التحقق غير صالح أو انتهت صلاحيته');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <AuthHero icon="🫁" title="تفعيل الحساب" subtitle="تأكيد بريدك الإلكتروني لتفعيل حسابك على PulmoHTapAlgérie" />
      <div className="auth-form-side">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          {status === 'verifying' && (
            <>
              <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px', borderColor: 'rgba(13,148,136,.2)', borderTopColor: '#0d9488' }} />
              <h2 className="auth-card__title">جاري التفعيل...</h2>
              <p className="auth-card__subtitle">يُرجى الانتظار لحظة أثناء التأكد من رابطك</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 className="auth-card__title">تم التفعيل بنجاح!</h2>
              <p className="auth-card__subtitle">{message}</p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: 20 }}>
                تسجيل الدخول الآن
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
              <h2 className="auth-card__title">فشل التفعيل</h2>
              <p className="auth-card__subtitle" style={{ color: 'var(--color-danger)' }}>{message}</p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: 20 }}>
                العودة لتسجيل الدخول
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
