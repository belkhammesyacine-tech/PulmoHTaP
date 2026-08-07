// core/components/DashboardNav.jsx — Top navigation bar for authenticated pages
import { Link } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang }  from '../context/LanguageContext.jsx';
import NotificationBell from './NotificationBell.jsx';

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, switchLang, t } = useLang();

  const isAdmin   = ['PLATFORM_ADMIN', 'CLINIC_ADMIN'].includes(user?.accountType);
  const isDoctor  = ['DOCTOR', 'SPECIALIST'].includes(user?.accountType);
  const isPatient = user?.accountType === 'PATIENT';

  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">
        <img src="/pulmoHTap-LOGO.png" alt="PulmoHTap" style={{ height: 36, objectFit: 'contain' }} />
        <span>PulmoHTap</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/appointments" className="btn-link" style={{ fontSize: 14 }}>
          {t('nav.appointments')}
        </Link>
        <Link to="/records" className="btn-link" style={{ fontSize: 14 }}>
          {t('nav.records')}
        </Link>
<<<<<<< HEAD
        <Link to="/chat" className="btn-link" style={{ fontSize: 14 }}>
          💬 {t('nav.chat')}
        </Link>
        {(isPatient || isDoctor) && (
          <Link to="/find-doctor" className="btn-link" style={{ fontSize: 14 }}>
            🔍 {t('nav.find_doctor')}
=======
        {(isPatient || isDoctor) && (
          <Link to="/find-doctor" className="btn-link" style={{ fontSize: 14 }}>
            🔍 أطباء
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
          </Link>
        )}
        {isDoctor && (
          <Link to="/verify-doctor" className="btn-link" style={{ fontSize: 14 }}>
<<<<<<< HEAD
            🔖 {t('nav.verify_doctor')}
=======
            🔖 توثيق
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="btn-link" style={{ fontSize: 14 }}>
<<<<<<< HEAD
            ⚙️ {t('nav.admin')}
=======
            ⚙️ الإدارة
>>>>>>> 7c250262aee13c69b171f965798c62acb3babb6d
          </Link>
        )}
        <Link to="/profile" className="btn-link" style={{ fontSize: 14 }}>
          {t('nav.profile')}
        </Link>
        <Link to="/sessions" className="btn-link" style={{ fontSize: 14 }}>
          {t('nav.sessions')}
        </Link>

        {/* Divider */}
        <span style={{ width: 1, height: 20, background: 'var(--color-border)', display: 'block' }} />

        {/* Notification Bell */}
        <NotificationBell />

        {/* Language Switcher */}
        <div className="lang-switcher">
          <button className={`lang-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => switchLang('ar')}>ع</button>
          <button className={`lang-btn${lang === 'fr' ? ' active' : ''}`} onClick={() => switchLang('fr')}>Fr</button>
        </div>

        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? t('theme.dark') : t('theme.light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button
          onClick={logout}
          className="btn btn-primary"
          style={{ padding: '8px 18px', fontSize: 13, width: 'auto' }}
        >
          {t('nav.logout')}
        </button>
      </div>
    </nav>
  );
}
