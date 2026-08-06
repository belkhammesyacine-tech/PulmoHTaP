// features/users/pages/FindDoctorPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import client from '../../../core/api/client.js';
import { WILAYAS } from '../../../core/constants/wilayas.js';

const WILAYA_LABELS = {
  ADRAR: 'أدرار', CHLEF: 'الشلف', LAGHOUAT: 'الأغواط', OUM_EL_BOUAGHI: 'أم البواقي',
  BATNA: 'باتنة', BEJAIA: 'بجاية', BISKRA: 'بسكرة', BECHAR: 'بشار', BLIDA: 'البليدة',
  BOUIRA: 'البويرة', TAMANRASSET: 'تمنراست', TEBESSA: 'تبسة', TLEMCEN: 'تلمسان',
  TIARET: 'تيارت', TIZI_OUZOU: 'تيزي وزو', ALGER: 'الجزائر', DJELFA: 'الجلفة',
  JIJEL: 'جيجل', SETIF: 'سطيف', SAIDA: 'سعيدة', SKIKDA: 'سكيكدة',
  SIDI_BEL_ABBES: 'سيدي بلعباس', ANNABA: 'عنابة', GUELMA: 'قالمة',
  CONSTANTINE: 'قسنطينة', MEDEA: 'المدية', MOSTAGANEM: 'مستغانم', MSILA: 'المسيلة',
  MASCARA: 'معسكر', OUARGLA: 'ورقلة', ORAN: 'وهران', EL_BAYADH: 'البيض',
  ILLIZI: 'إليزي', BORDJ_BOU_ARRERIDJ: 'برج بوعريريج', BOUMERDES: 'بومرداس',
  EL_TARF: 'الطارف', TINDOUF: 'تندوف', TISSEMSILT: 'تيسمسيلت', EL_OUED: 'الوادي',
  KHENCHELA: 'خنشلة', SOUK_AHRAS: 'سوق أهراس', TIPAZA: 'تيبازة', MILA: 'ميلة',
  AIN_DEFLA: 'عين الدفلى', NAAMA: 'النعامة', AIN_TEMOUCHENT: 'عين تموشنت',
  GHARDAIA: 'غرداية', RELIZANE: 'غليزان', TIMIMOUN: 'تيميمون',
  BORDJ_BADJI_MOKHTAR: 'برج باجي مختار', OULED_DJELLAL: 'أولاد جلال',
  BENI_ABBES: 'بني عباس', IN_SALAH: 'عين صالح', IN_GUEZZAM: 'عين قزام',
  TOUGGOURT: 'تقرت', DJANET: 'جانت', EL_MGHAIR: 'المغير', EL_MENIAA: 'المنيعة',
};

function BookingModal({ doctor, onClose, onBooked }) {
  const [form, setForm] = useState({ date: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await client.post('/appointments', { doctorId: doctor.id, ...form });
      onBooked();
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📅 حجز موعد</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginBottom: 16, padding: 12, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
          <strong>د. {doctor.fullName}</strong>
          {doctor.doctorVerification?.specialty && (
            <span style={{ marginRight: 8, color: 'var(--color-primary)', fontSize: 13 }}>
              — {doctor.doctorVerification.specialty}
            </span>
          )}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fd-date">التاريخ والوقت *</label>
            <input
              id="fd-date"
              type="datetime-local"
              className="form-input"
              required
              min={new Date().toISOString().slice(0, 16)}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fd-reason">سبب الزيارة (اختياري)</label>
            <textarea
              id="fd-reason"
              className="form-input"
              rows={3}
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>إلغاء</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? <span className="spinner" /> : '✓ تأكيد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FindDoctorPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isPatient = user?.accountType === 'PATIENT';

  const [wilaya,    setWilaya]    = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors,   setDoctors]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [searched,  setSearched]  = useState(false);
  const [bookTarget, setBookTarget] = useState(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (wilaya)    params.set('wilaya', wilaya);
      if (specialty) params.set('specialty', specialty);
      const res = await client.get(`/doctors?${params}`);
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [wilaya, specialty]);

  // Load all on mount
  useEffect(() => { search(); }, []); // eslint-disable-line

  const handleBooked = () => {
    setBookTarget(null);
    setBookedSuccess(true);
    setTimeout(() => setBookedSuccess(false), 3000);
  };

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        {/* Search bar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h1 className="card-title">🔍 البحث عن طبيب</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: 14 }}>
            ابحث عن طبيب أو مختص في ولايتك أو حسب التخصص.
          </p>

          {bookedSuccess && (
            <div className="alert alert-success">✅ تم إرسال طلب الحجز بنجاح! يمكنك متابعته من صفحة المواعيد.</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="fd-wilaya">الولاية</label>
              <select
                id="fd-wilaya"
                className="form-input form-select"
                value={wilaya}
                onChange={e => setWilaya(e.target.value)}
              >
                <option value="">— كل الولايات —</option>
                {WILAYAS.map(w => (
                  <option key={w} value={w}>{WILAYA_LABELS[w] || w}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="fd-specialty">التخصص</label>
              <input
                id="fd-specialty"
                type="text"
                className="form-input"
                placeholder="مثال: أمراض الرئة، قلب..."
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
              />
            </div>

            <button
              id="btn-search-doctor"
              className="btn btn-primary"
              style={{ padding: '12px 28px', whiteSpace: 'nowrap' }}
              onClick={search}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : '🔍 بحث'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              {searched ? `${doctors.length} طبيب/مختص` : 'جميع الأطباء المتاحين'}
            </h2>
          </div>

          {loading ? (
            <div className="spinner" style={{ margin: '40px auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488', width: 28, height: 28 }} />
          ) : doctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p>لا توجد نتائج مطابقة لبحثك.</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>جرّب تغيير الولاية أو التخصص.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-card__img-wrap">
                    {doctor.profile?.avatarUrl ? (
                      <img src={doctor.profile.avatarUrl} alt={doctor.fullName} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, background: 'var(--color-primary-light)' }}>
                        🩺
                      </div>
                    )}
                  </div>
                  <div className="doctor-card__body">
                    <div className="doctor-card__name">د. {doctor.fullName}</div>
                    {doctor.doctorVerification?.specialty && (
                      <div className="doctor-card__spec">{doctor.doctorVerification.specialty}</div>
                    )}
                    {doctor.doctorVerification?.institution && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        🏥 {doctor.doctorVerification.institution}
                      </div>
                    )}
                    {doctor.profile?.wilaya && (
                      <div className="doctor-card__wilaya">
                        📍 {WILAYA_LABELS[doctor.profile.wilaya] || doctor.profile.wilaya}
                      </div>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <span className="badge badge-success" style={{ fontSize: 11 }}>✓ موثق</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginRight: 8 }}>
                        {doctor.accountType === 'SPECIALIST' ? 'مختص' : 'طبيب'}
                      </span>
                    </div>
                    {isPatient && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', marginTop: 14 }}
                        onClick={() => setBookTarget(doctor)}
                      >
                        📅 حجز موعد
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {bookTarget && (
        <BookingModal
          doctor={bookTarget}
          onClose={() => setBookTarget(null)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
