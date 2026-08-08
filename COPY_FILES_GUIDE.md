# دليل الملفات المنسوخة (Copy Files Guide)

## 📌 الهيكلة العامة
المشروع مبني بهيكلة **Feature-based** لضمان قابلية التوسع والصيانة (Scalability & Maintainability).

### 📁 العميل (Client)
المسار الرئيسي: `client/src/`
- `core/`: يحتوي على المكونات المشتركة، السياق (Context)، وأدوات الـ API.
- `features/`: مقسم حسب الميزة (Auth, Appointments, Records)، وكل ميزة لها `api` و `pages` الخاصة بها.
- `assets/` & `public/`: الصور والشعارات (مثل `pulmoHTap-LOGO.png`).

### 📁 الخادم (Server)
المسار الرئيسي: `server/src/`
- `core/`: الأخطاء (Errors)، الـ Middleware، وأدوات المكتبات (Prisma, Zod, Logger).
- `features/`: كل ميزة تحتوي على `routes`, `controller`, `service`, `schema`.

## 🔄 كيفية قراءة أو نسخ الأكواد؟
كل ملف يحتوي في السطر الأول على مساره داخل المشروع كتعليق، مثل:
`// features/appointments/pages/AppointmentsPage.jsx`

تأكد دائماً عند نسخك لملف أن تضعه في المجلد المطابق له تماماً للحفاظ على سلامة مسارات الـ Imports.
