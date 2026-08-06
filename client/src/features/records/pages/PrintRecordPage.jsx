// features/records/pages/PrintRecordPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../../core/api/client.js';
import { useAuth } from '../../../core/context/AuthContext.jsx';

const RECORD_TYPES = {
  DIAGNOSIS:    'تشخيص',
  PRESCRIPTION: 'وصفة طبية',
  LAB_TEST:     'تحليل مخبري',
  XRAY:         'أشعة',
  GENERAL_NOTE: 'ملاحظة',
};

export default function PrintRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the single record by id
    client.get(`/records/${id}`)
      .then(res => {
        setRecord(res.data.record);
        // Automatically trigger print dialog after state updates and DOM renders
        setTimeout(() => {
          window.print();
        }, 500);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'حدث خطأ في جلب السجل');
      });

    // Listen to afterprint event to close or navigate back automatically
    const handleAfterPrint = () => {
      // Return to the records page (or close tab if we opened a new one, but react-router push is safer)
      navigate('/records');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [id, navigate]);

  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!record) {
    return <div style={{ padding: 40, textAlign: 'center' }}>جاري التحضير للطباعة...</div>;
  }

  const t = RECORD_TYPES[record.type] || record.type;

  return (
    <div className="print-page" style={{ direction: 'rtl', fontFamily: 'var(--font-primary)' }}>
      {/* 1. Header: Doctor & Clinic Info */}
      <div className="print-header">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--color-primary-dark)' }}>
            د. {record.doctor.fullName}
          </h1>
          <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>
            تخصص: {record.doctor.doctorVerification?.specialty || 'الطب العام'}
          </p>
          <p style={{ margin: '0', fontSize: 14, color: '#555' }}>
            المؤسسة: {record.doctor.doctorVerification?.institution || 'مؤسسة طبية خاصة'}
          </p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <img src="/pulmoHTap-LOGO.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
          <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--color-primary)' }}>
            PulmoHTap Algérie
          </div>
        </div>
      </div>

      {/* 2. Patient Info & Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, paddingBottom: 10, borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: 16 }}>
          <strong>اسم المريض:</strong> {record.patient.fullName}
        </div>
        <div style={{ fontSize: 16 }}>
          <strong>تاريخ الزيارة:</strong> {new Date(record.createdAt).toLocaleDateString('ar-DZ')}
        </div>
      </div>

      {/* 3. Record Content (Prescription / Diagnosis) */}
      <div style={{ minHeight: '400px' }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ 
            display: 'inline-block',
            padding: '4px 12px',
            background: '#eee',
            borderRadius: 4,
            fontWeight: 'bold',
            fontSize: 14
          }}>
            {t}
          </span>
          <h2 style={{ marginTop: 10, fontSize: 20 }}>{record.title}</h2>
        </div>

        <div style={{ 
          fontSize: 16, 
          lineHeight: 2, 
          whiteSpace: 'pre-wrap' 
        }}>
          {record.description}
        </div>
      </div>

      {/* 4. Footer */}
      <div className="print-footer">
        <p style={{ margin: 0 }}>
          تم إصدار هذه الوثيقة إلكترونياً عبر منصة PulmoHTap Algérie
        </p>
        <p style={{ margin: 0, fontSize: 11, color: '#999' }}>
          للتأكد من صحة الوثيقة يرجى مراجعة النظام.
        </p>
        <p style={{ margin: 0, marginTop: 40, fontWeight: 'bold', textAlign: 'left', paddingLeft: 40 }}>
          ختم وتوقيع الطبيب: ..........................
        </p>
      </div>
    </div>
  );
}
