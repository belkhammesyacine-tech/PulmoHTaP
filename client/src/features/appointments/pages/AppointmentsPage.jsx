// features/appointments/pages/AppointmentsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

const STATUS_MAP = {
  PENDING:   { label: 'قيد الانتظار', cls: 'badge-warning' },
  CONFIRMED: { label: 'مؤكد',         cls: 'badge-success' },
  CANCELLED: { label: 'ملغى',         cls: 'badge-danger'  },
  COMPLETED: { label: 'مكتمل',        cls: 'badge-primary' },
};

function BookingModal({ onClose, onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm]       = useState({ doctorId: '', date: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    client.get('/doctors').then(r => setDoctors(r.data.doctors)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await client.post('/appointments', form);
      onSuccess();
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
          <h2 className="modal-title">📅 حجز موعد جديد</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="apt-doctor">الطبيب *</label>
            <select
              id="apt-doctor"
              className="form-input form-select"
              required
              value={form.doctorId}
              onChange={e => setForm({ ...form, doctorId: e.target.value })}
            >
              <option value="">— اختر الطبيب —</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  د. {d.fullName}
                  {d.doctorVerification?.specialty ? ` — ${d.doctorVerification.specialty}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="apt-date">التاريخ والوقت *</label>
            <input
              id="apt-date"
              type="datetime-local"
              className="form-input"
              required
              min={new Date().toISOString().slice(0, 16)}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="apt-reason">سبب الزيارة (اختياري)</label>
            <textarea
              id="apt-reason"
              className="form-input"
              rows={3}
              placeholder="وصف مختصر للحالة..."
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>إلغاء</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? <span className="spinner" /> : '✓ تأكيد الحجز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(user?.accountType);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    client.get('/appointments')
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const changeStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await client.put(`/appointments/${id}`, { status });
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status } : a)
      );
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 className="card-title" style={{ marginBottom: 0 }}>📅 المواعيد</h1>
            {!isDoctor && (
              <button
                id="btn-new-appointment"
                className="btn btn-primary btn-sm"
                onClick={() => setShowModal(true)}
              >
                + حجز موعد جديد
              </button>
            )}
          </div>

          {loading ? (
            <div className="spinner" style={{ margin: '40px auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488', width: 28, height: 28 }} />
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>لا توجد مواعيد حالياً.</p>
              {!isDoctor && (
                <button className="btn btn-primary btn-inline" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
                  احجز أول موعد
                </button>
              )}
            </div>
          ) : (
            <div className="cards-grid cards-grid--3">
              {appointments.map(apt => {
                const s = STATUS_MAP[apt.status] || { label: apt.status, cls: 'badge-primary' };
                return (
                  <div key={apt.id} className="apt-card">
                    <div className="apt-card__date">
                      🗓 {new Date(apt.date).toLocaleString('ar-DZ', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <div className="apt-card__who">
                      {isDoctor
                        ? `👤 المريض: ${apt.patient.fullName}`
                        : `🩺 الطبيب: ${apt.doctor.fullName}`}
                    </div>
                    {apt.reason && (
                      <div className="apt-card__reason">💬 {apt.reason}</div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span className={`badge ${s.cls}`}>{s.label}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {isDoctor && apt.status === 'PENDING' && (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--color-success)', color: '#fff', padding: '5px 12px', fontSize: 12 }}
                              disabled={actionLoading === apt.id + 'CONFIRMED'}
                              onClick={() => changeStatus(apt.id, 'CONFIRMED')}
                            >قبول</button>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--color-danger)', color: '#fff', padding: '5px 12px', fontSize: 12 }}
                              disabled={actionLoading === apt.id + 'CANCELLED'}
                              onClick={() => changeStatus(apt.id, 'CANCELLED')}
                            >رفض</button>
                          </>
                        )}
                        {isDoctor && apt.status === 'CONFIRMED' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: 'var(--color-primary)', color: '#fff', padding: '5px 12px', fontSize: 12 }}
                            disabled={actionLoading === apt.id + 'COMPLETED'}
                            onClick={() => changeStatus(apt.id, 'COMPLETED')}
                          >إنهاء الموعد</button>
                        )}
                        {!isDoctor && apt.status === 'PENDING' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: 'var(--color-danger)', color: '#fff', padding: '5px 12px', fontSize: 12 }}
                            disabled={actionLoading === apt.id + 'CANCELLED'}
                            onClick={() => changeStatus(apt.id, 'CANCELLED')}
                          >إلغاء</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <BookingModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchAppointments(); }}
        />
      )}
    </div>
  );
}
