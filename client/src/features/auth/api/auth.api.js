// features/auth/api/auth.api.js — Auth API calls
import api from '../../../core/api/client.js';

export const authApi = {
  register:      (data) => api.post('/auth/register', data),
  login:         (data) => api.post('/auth/login', data),
  logout:        ()     => api.post('/auth/logout'),
  refresh:       ()     => api.post('/auth/refresh'),
  forgotPassword:(data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail:   (token)=> api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  getMe:         ()     => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  changePassword:(data) => api.patch('/users/me/password', data),
  getSessions:   ()     => api.get('/users/me/sessions'),
  revokeSession: (id)   => api.delete(`/users/me/sessions/${id}`),
  revokeAll:     ()     => api.delete('/users/me/sessions'),
};
