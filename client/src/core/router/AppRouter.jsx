// core/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import LandingPage            from '../../features/landing/pages/LandingPage.jsx';
import LoginPage              from '../../features/auth/pages/LoginPage.jsx';
import RegisterPage           from '../../features/auth/pages/RegisterPage.jsx';
import ForgotPasswordPage     from '../../features/auth/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage      from '../../features/auth/pages/ResetPasswordPage.jsx';
import VerifyEmailPage        from '../../features/auth/pages/VerifyEmailPage.jsx';
import DashboardPage          from '../../features/auth/pages/DashboardPage.jsx';
import ProfilePage            from '../../features/auth/pages/ProfilePage.jsx';
import SessionsPage           from '../../features/auth/pages/SessionsPage.jsx';
import AppointmentsPage       from '../../features/appointments/pages/AppointmentsPage.jsx';
import RecordsPage            from '../../features/records/pages/RecordsPage.jsx';
import PrintRecordPage        from '../../features/records/pages/PrintRecordPage.jsx';
import DoctorVerificationPage from '../../features/users/pages/DoctorVerificationPage.jsx';
import FindDoctorPage         from '../../features/users/pages/FindDoctorPage.jsx';
import ChatPage               from '../../features/chat/pages/ChatPage.jsx';
import AdminDashboardPage     from '../../features/admin/pages/AdminDashboardPage.jsx';
import NotFoundPage           from '../pages/NotFoundPage.jsx';

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
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="/records/:id/print" element={<ProtectedRoute><PrintRecordPage /></ProtectedRoute>} />
        <Route path="/find-doctor" element={<ProtectedRoute><FindDoctorPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/verify-doctor" element={<ProtectedRoute><DoctorVerificationPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
