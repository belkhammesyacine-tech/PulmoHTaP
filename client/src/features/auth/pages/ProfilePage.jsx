// features/auth/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import { authApi } from '../api/auth.api.js';

const WILAYAS = [
  'ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM_EL_BOUAGHI', 'BATNA', 'BEJAIA', 'BISKRA', 'BECHAR', 'BLIDA', 'BOUIRA',
  'TAMANRASSET', 'TEBESSA', 'TLEMCEN', 'TIARET', 'TIZI_OUZOU', 'ALGER', 'DJELFA', 'JIJEL', 'SETIF', 'SAIDA',
  'SKIKDA', 'SIDI_BEL_ABBES', 'ANNABA', 'GUELMA', 'CONSTANTINE', 'MEDEA', 'MOSTAGANEM', 'MSILA', 'MASCARA',
  'OUARGLA', 'ORAN', 'EL_BAYADH', 'ILLIZI', 'BORDJ_BOU_ARRERIDJ', 'BOUMERDES', 'EL_TARF', 'TINDOUF', 'TISSEMSILT',
  'EL_OUED', 'KHENCHELA', 'SOUK_AHRAS', 'TIPAZA', 'MILA', 'AIN_DEFLA', 'NAAMA', 'AIN_TEMOUCHENT', 'GHARDAIA',
  'RELIZANE', 'TIMIMOUN', 'BORDJ_BADJI_MOKHTAR', 'OULED_DJELLAL', 'BENI_ABBES', 'IN_SALAH', 'IN_GUEZZAM',
  'TOUGGOURT', 'DJANET', 'EL_MGHAIR', 'EL_MENIAA',
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    profile: {
      wilaya: user?.profile?.wilaya || '',
      address: user?.profile?.address || '',
      emergencyContact: user?.profile?.emergencyContact || '',
    },
  });

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });

  const [msg, setMsg]           = useState({ type: '', text: '' });
  const [passMsg, setPassMsg]   = useState({ type: '', text: '' });
  const [loading, setLoading]   = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        profile: {
          wilaya: user.profile?.wilaya || '',
          address: user.profile?.address || '',
          emergencyContact: user.profile?.emergencyContact || '',
        },
      });
    }
  }, [user]);

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setLoading(true);
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      setMsg({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'فشل التحديث' });
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    setPassLoading(true);
    try {
      await authApi.updateProfile(passForm); // calls patch on /users/me or /users/me/password
      setPassMsg({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح' });
      setPassForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.error || 'فشل تغيير كلمة المرور' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="nav-brand">
          <span>←</span>
          <span>العودة للوحة التحكم</span>
        </Link>
      </nav>

      <main className="dashboard-content">
        <div className="card">
          <h1 className="card-title">تعديل الملف الشخصي</h1>

          {msg.text && (
            <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={onUpdateProfile}>
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <input type="text" className="form-input" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">رقم الهاتف</label>
              <input type="tel" className="form-input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">الولاية (من 58 ولاية)</label>
              <select className="form-input form-select" value={form.profile.wilaya}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, wilaya: e.target.value } })}>
                <option value="">-- اختر ولايتك --</option>
                {WILAYAS.map((w, idx) => (
                  <option key={w} value={w}>{idx + 1}. {w}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">العنوان</label>
              <input type="text" className="form-input" value={form.profile.address}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, address: e.target.value } })} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغيرات'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
