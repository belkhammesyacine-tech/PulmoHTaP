// core/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LandingPage        from '../../features/landing/pages/LandingPage.jsx';
import LoginPage          from '../../features/auth/pages/LoginPage.jsx';
import RegisterPage       from '../../features/auth/pages/RegisterPage.jsx';
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage  from '../../features/auth/pages/ResetPasswordPage.jsx';
import VerifyEmailPage    from '../../features/auth/pages/VerifyEmailPage.jsx';
import DashboardPage      from '../../features/auth/pages/DashboardPage.jsx';
import ProfilePage        from '../../features/auth/pages/ProfilePage.jsx';
import SessionsPage       from '../../features/auth/pages/SessionsPage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{ width: 32, height: 32, borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488' }} />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/verify-email"    element={<VerifyEmailPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/sessions"  element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
