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
        {/* رابط اللوجو والاسم */}
        <Link to="/" className="site-brand flex items-center gap-3">
         <img 
  src="/pulmoHTap-LOGO.png" 
  alt="PulmoHTap Logo" 
  className="h-11 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
/>
          <div className="flex flex-col">
            <span className="site-brand__text leading-none">
              <strong>PulmoHTap</strong>
              <small className="text-cyan-400 mr-1">Algérie</small>
            </span>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
              Breathe Better. Live Better.
            </span>
          </div>
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