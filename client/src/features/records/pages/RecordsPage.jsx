// features/records/pages/RecordsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import client from '../../../core/api/client.js';

const RECORD_TYPES = {
  DIAGNOSIS:    { label: 'تشخيص',      icon: '🔬' },
  PRESCRIPTION: { label: 'وصفة طبية',  icon: '💊' },
  LAB_TEST:     { label: 'تحليل مخبري', icon: '🧪' },
  XRAY:         { label: 'أشعة',        icon: '🩻' },
  GENERAL_NOTE: { label: 'ملاحظة',     icon: '📝' },
};

function AddRecordModal({ onClose, onSuccess }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: '', type: 'GENERAL_NOTE', title: '', description: '', attachment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Load patient list from appointments (doctors can only record for their patients)
  useEffect(() => {
    client.get('/appointments')
      .then(r => {
        const uniquePatients = [];
        const seen = new Set();
        r.data.appointments.forEach(a => {
          if (!seen.has(a.patient.id)) {
            seen.add(a.patient.id);
            uniquePatients.push(a.patient);
          }
        });
        setPatients(uniquePatients);
      })
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = { ...form };
      if (!body.attachment) delete body.attachment;
      await client.post('/records', body);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📋 إضافة سجل طبي</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="rec-patient">المريض *</label>
            <select
              id="rec-patient"
              className="form-input form-select"
              required
              value={form.patientId}
              onChange={e => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">— اختر المريض —</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rec-type">نوع السجل *</label>
            <select
              id="rec-type"
              className="form-input form-select"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              {Object.entries(RECORD_TYPES).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rec-title">العنوان *</label>
            <input
              id="rec-title"
              type="text"
              className="form-input"
              required
              placeholder="مثال: تشخيص ارتفاع ضغط الدم الرئوي"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rec-desc">التفاصيل *</label>
            <textarea
              id="rec-desc"
              className="form-input"
              rows={4}
              required
              placeholder="وصف تفصيلي للحالة، الأعراض، النتائج..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rec-attach">رابط المرفق (PDF / صورة) — اختياري</label>
            <input
              id="rec-attach"
              type="url"
              className="form-input"
              placeholder="https://..."
              value={form.attachment}
              onChange={e => setForm({ ...form, attachment: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>إلغاء</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? <span className="spinner" /> : '✓ حفظ السجل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RecordDetailModal({ record, onClose }) {
  const t = RECORD_TYPES[record.type] || { label: record.type, icon: '📄' };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.icon} {record.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div><span className={`badge badge-primary`}>{t.label}</span></div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            <strong>المريض:</strong> {record.patient.fullName} &nbsp;|&nbsp;
            <strong>الطبيب:</strong> {record.doctor.fullName}
          </div>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: 16, fontSize: 14, lineHeight: 1.8 }}>
            {record.description}
          </div>
          {record.attachment && (
            <a href={record.attachment} target="_blank" rel="noreferrer" className="btn-link">
              📎 عرض المرفق
            </a>
          )}
          <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
            تاريخ الإنشاء: {new Date(record.createdAt).toLocaleDateString('ar-DZ')}
          </div>
        </div>
        <div style={{ marginTop: 20, textAlign: 'left' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const { user } = useAuth();
  const isDoctor = ['DOCTOR', 'SPECIALIST'].includes(user?.accountType);

  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showAdd, setShowAdd]       = useState(false);
  const [selectedRecord, setSelected] = useState(null);

  const fetchRecords = useCallback(() => {
    setLoading(true);
    client.get('/records')
      .then(res => setRecords(res.data.records))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  return (
    <div className="dashboard">
      <DashboardNav />
      <main className="dashboard-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 className="card-title" style={{ marginBottom: 0 }}>📋 السجلات الطبية</h1>
            {isDoctor && (
              <button
                id="btn-add-record"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAdd(true)}
              >
                + إضافة سجل
              </button>
            )}
          </div>

          {loading ? (
            <div className="spinner" style={{ margin: '40px auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488', width: 28, height: 28 }} />
          ) : records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>لا توجد سجلات طبية حالياً.</p>
            </div>
          ) : (
            <div className="cards-grid cards-grid--3">
              {records.map(record => {
                const t = RECORD_TYPES[record.type] || { label: record.type, icon: '📄' };
                return (
                  <div
                    key={record.id}
                    className="record-card"
                    onClick={() => setSelected(record)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="record-card__icon">{t.icon}</div>
                    <div className="record-card__title">{record.title}</div>
                    <div className="record-card__who" style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 8px' }}>
                      {isDoctor ? `👤 ${record.patient.fullName}` : `🩺 ${record.doctor.fullName}`}
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: 11 }}>{t.label}</span>
                    <p style={{ marginTop: 10, fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      {record.description.length > 80
                        ? `${record.description.substring(0, 80)}...`
                        : record.description}
                    </p>
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-text-subtle)' }}>
                      {new Date(record.createdAt).toLocaleDateString('ar-DZ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddRecordModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchRecords(); }}
        />
      )}

      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
