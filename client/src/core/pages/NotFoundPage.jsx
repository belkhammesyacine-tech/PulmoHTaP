// core/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <div className="auth-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 100, minHeight: '80vh' }}>
        <div style={{ fontSize: 100, marginBottom: 20 }}>404</div>
        <h1 className="hero__title" style={{ color: 'var(--color-primary-dark)' }}>الصفحة غير موجودة</h1>
        <p className="hero__subtitle" style={{ color: 'var(--color-text-muted)' }}>عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>العودة للرئيسية</Link>
      </div>
      <SiteFooter />
    </>
  );
}
