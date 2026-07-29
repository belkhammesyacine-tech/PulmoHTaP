// core/components/DashboardNav.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardNav({ backTo, backLabel }) {
  const { logout } = useAuth();

  if (backTo) {
    return (
      <nav className="dashboard-nav">
        <Link to={backTo} className="nav-brand">
          <span>←</span>
          <span>{backLabel}</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="dashboard-nav">
      <Link to="/" className="nav-brand">
        <span>🫁</span>
        <span>PulmoHTapAlgérie</span>
      </Link>
      <div className="dashboard-nav__actions">
        <Link to="/profile" className="btn-link">الملف الشخصي</Link>
        <Link to="/sessions" className="btn-link">الجلسات النشطة</Link>
        <button type="button" onClick={logout} className="btn btn-primary btn-sm">
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}
