// core/components/SiteHeader.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang }  from '../context/LanguageContext.jsx';

export default function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, switchLang, t } = useLang();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  const NAV_LINKS = [
    { href: '#home',     label: t('nav.home') },
    { href: '#about',    label: t('nav.about') },
    { href: '#accounts', label: t('nav.accounts') },
    { href: '#services', label: t('nav.services') },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand">
          <span className="site-brand__icon">
            <img src="/pulmoHTap-LOGO.png" alt="PulmoHTap Logo" />
          </span>
          <span className="site-brand__text">
            <strong>PulmoHTap</strong>
            <small>Algérie</small>
          </span>
        </Link>

        {isLanding && (
          <nav className="site-nav" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="site-nav__link">
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="site-header__actions">
          {/* Language Switcher */}
          <div className="lang-switcher" role="group" aria-label="Language">
            <button
              className={`lang-btn${lang === 'ar' ? ' active' : ''}`}
              onClick={() => switchLang('ar')}
              title="العربية"
            >
              ع
            </button>
            <button
              className={`lang-btn${lang === 'fr' ? ' active' : ''}`}
              onClick={() => switchLang('fr')}
              title="Français"
            >
              Fr
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              {t('nav.dashboard')}
            </Link>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
