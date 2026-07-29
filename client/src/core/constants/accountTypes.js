export const ACCOUNT_TYPES = [
  { value: 'PATIENT', label: 'مريض', icon: '🤒', desc: 'متابعة حالتك الصحية وسجلاتك الطبية' },
  { value: 'DOCTOR', label: 'طبيب عام', icon: '👨‍⚕️', desc: 'إدارة ملفات المرضى والمتابعة السريرية' },
  { value: 'SPECIALIST', label: 'طبيب مختص', icon: '🩺', desc: 'تخصصات دقيقة في أمراض الرئة والقلب' },
  { value: 'LABORATORY', label: 'مخبر', icon: '🔬', desc: 'رفع نتائج التحاليل والفحوصات' },
  { value: 'PHARMACY', label: 'صيدلية', icon: '💊', desc: 'إدارة الوصفات والأدوية' },
  { value: 'PSYCHOLOGIST', label: 'أخصائي نفسي', icon: '🧠', desc: 'الدعم النفسي للمرضى وذويهم' },
  { value: 'RESEARCHER', label: 'باحث', icon: '📚', desc: 'البحث العلمي والدراسات السريرية' },
  { value: 'CLINIC_ADMIN', label: 'مسؤول مؤسسة صحية', icon: '🏥', desc: 'إدارة المؤسسات والعيادات' },
];

export const ACCOUNT_TYPE_LABELS = Object.fromEntries(
  ACCOUNT_TYPES.map(({ value, label }) => [value, label]),
);
