// core/components/SiteHeader.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من نحن' },
  { href: '#services', label: 'الخدمات' },
  { href: '#accounts', label: 'أنواع الحسابات' },
  { href: '#contact', label: 'تواصل معنا' },
];

export default function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand">
          <span className="site-brand__icon">🫁</span>
          <span className="site-brand__text">
            <strong>PulmoHTap</strong>
            <small>Algérie</small>
          </span>
        </Link>

        {isLanding && (
          <nav className="site-nav" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="site-nav__link">{link.label}</a>
            ))}
          </nav>
        )}

        <div className="site-header__actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">لوحة التحكم</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">تسجيل الدخول</Link>
              <Link to="/register" className="btn btn-primary btn-sm">إنشاء حساب</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
