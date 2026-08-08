# PulmoHTapAlgérie — PROJECT_MAP.md

> **حالة النظام الحالية**: المشروع مكتمل بالكامل — جميع الميزات الأساسية والمتقدمة منفّذة.

---

## [TECH_STACK]
- **Frontend**: React `19.2.8` + Vite `8.1.5` + React Router DOM `7.18.1` + Tailwind CSS v4
- **Backend**: Node.js `v24.18.0` + Express `5.2.1` + Socket.io `4.8.3`
- **ORM & Database**: Prisma `7.9.0` + PostgreSQL (Supabase)
- **Security & Auth**: JWT (`jsonwebtoken` `9.0.3`) + `bcryptjs` `3.0.3` + `helmet` `8.3.0` + `express-rate-limit` `8.6.1`
- **Validation**: Zod `4.4.3`
- **Logging**: Pino (Async non-blocking)
- **Email**: Nodemailer `9.0.3` (Gmail SMTP HTML RTL)
- **File Upload**: Multer + Supabase Storage
- **Real-time**: Socket.io (Chat + typing indicator + online status)

---

## [SYSTEM_FLOW]
1. **التسجيل (`POST /api/auth/register`)**: التحقق من البيانات بـ Zod -> التشفير بـ bcrypt -> إنشاء الحساب بحالة PENDING -> إرسال بريد تفعيل RTL -> حفظ سجل التدقيق AuditLog.
2. **التحقق من البريد (`GET /api/auth/verify-email`)**: التثبت من الرمز وصلاحيته -> تحويل الحالة إلى ACTIVE -> إتاحة الدخول.
3. **تسجيل الدخول (`POST /api/auth/login`)**: مطابقة الاعتمادات بشكل آمن من الهجمات الزمانية -> إصدار AccessToken (15m) و RefreshToken (7d) ممرر عبر HttpOnly Cookie.
4. **تجديد الجلسة (`POST /api/auth/refresh`)**: تجديد تلقائي آمن دون مقاطعة المستخدم عند انتهاء AccessToken.
5. **استعادة كلمة المرور (`POST /api/auth/forgot-password` & `reset-password`)**: حماية الحسابات من الفحص -> إرسال رابط آمن -> إعادة تعيين كلمة المرور وإلغاء جميع الجلسات القديمة.
6. **إدارة الجلسات والملف الشخصي (`/api/users/me`)**: تحديث بيانات 58 ولاية جزائرية، إنهاء الجلسات المحددة أو جميع الجلسات الأخرى.
7. **توثيق الأطباء (`DoctorVerification`)**: رفع بيانات الرخصة والمؤسسة + مرفق (PDF/صورة) عبر Supabase Storage -> مراجعة من الإدارة.
8. **البحث عن الأطباء (`GET /api/doctors`)**: فلترة الأطباء الموثقين بالولاية أو التخصص + حجز موعد مباشر من نتائج البحث.
9. **المواعيد (`/api/appointments`)**: المريض يحجز موعداً اختياراً الطبيب + التاريخ + سبب الزيارة. الطبيب يقبل/يرفض/ينهي الموعد. مع إشعار تلقائي.
10. **السجلات الطبية (`/api/records`)**: الطبيب يضيف تشخيص/وصفة/تحليل للمريض مع مرفقات. المريض يطلع على سجلاته ويطبعها.
11. **الإشعارات (`/api/notifications`)**: إشعارات داخلية فورية عند تغيير حالة المواعيد. جرس إشعارات في الـ Navbar.
12. **المحادثات الفورية (`Socket.io`)**: دردشة مباشرة بين المريض وطبيبه. مؤشر كتابة + حالة الاتصال.
13. **لوحة الإدارة (`/api/admin`)**: إحصاءات المنصة الشاملة + مراجعة وقبول/رفض طلبات توثيق الأطباء.

---

## [ARCHITECTURE]
```
PulmoHTaP4/
├── server/
│   ├── prisma/
│   │   └── schema.prisma        (User, UserProfile, Session, EmailVerification, PasswordReset, DoctorVerification, AuditLog, Wilaya [58], Appointment, MedicalRecord, Notification, ChatMessage)
│   └── src/
│       ├── core/                (prisma, token, email, logger, AppError, authenticate, authorize, validate, rateLimiter)
│       └── features/
│           ├── auth/            (schema, service, controller, routes)
│           ├── users/           (service, controller, routes, doctors.routes)
│           ├── appointments/    (service, controller, routes, schema)
│           ├── records/         (service, controller, routes, schema)
│           ├── admin/           (service, controller, routes)
│           ├── notifications/   (service, controller, routes)
│           ├── uploads/         (controller, routes) — Supabase Storage
│           └── chat/            (service, controller, routes, socket)
└── client/
    └── src/
        ├── core/
        │   ├── components/      (SiteHeader, SiteFooter, AuthHero, DashboardNav, NotificationBell)
        │   ├── constants/       (accountTypes, wilayas)
        │   ├── context/         (AuthContext, ThemeContext, LanguageContext)
        │   ├── api/             (client.js — Axios + auto-refresh)
        │   └── router/          (AppRouter)
        ├── locales/             (ar.json, fr.json — i18n RTL)
        └── features/
            ├── landing/         (LandingPage — صفحة رئيسية طبية RTL)
            ├── auth/            (LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, DashboardPage, ProfilePage, SessionsPage)
            ├── appointments/    (AppointmentsPage — حجز + قبول/رفض/إنهاء)
            ├── records/         (RecordsPage — إضافة/عرض/طباعة, PrintRecordPage)
            ├── users/           (DoctorVerificationPage, FindDoctorPage)
            ├── chat/            (ChatPage — Socket.io real-time)
            └── admin/           (AdminDashboardPage — إحصاءات + توثيق)
```

---

## [ORPHANS & PENDING]
- `[x]` إضافة كلمة سر قاعدة بيانات Supabase النهائية ورمز Gmail App Password في ملف `.env`.
- `[x]` إضافة نموذج Notification عند تغيير حالة الموعد في `appointments.service.js` (استدعاء `createNotification`).

## [UI_DESIGN]
- **الثيم**: Teal طبي (#0d9488) — glassmorphism — RTL عربي — Dark/Light mode
- **الصفحة الرئيسية** (`/`): Hero + شريط بحث سريع (ولاية/نوع حساب) + من نحن + أنواع الحسابات + إحصائيات + خدمات + Footer CTA
- **المسارات**: `/` عامة | `/login` `/register` ضيف | `/dashboard` `/profile` `/sessions` `/appointments` `/records` `/find-doctor` `/chat` `/verify-doctor` `/admin` محمية
- **i18n**: عربي (RTL) + فرنسي (LTR) — قابل للتوسع

## [COMPLETED_FEATURES]
- ✅ نظام المصادقة الكامل (تسجيل، دخول، تحقق بريد، استعادة كلمة المرور)
- ✅ إدارة الجلسات والملف الشخصي
- ✅ توثيق الأطباء (رفع وثائق + مراجعة إدارية)
- ✅ البحث عن طبيب بالولاية/التخصص + حجز مباشر
- ✅ إدارة المواعيد (حجز، قبول، رفض، إلغاء، إنهاء)
- ✅ السجلات الطبية الإلكترونية (إضافة، عرض، طباعة، مرفقات)
- ✅ رفع الملفات (Supabase Storage)
- ✅ إشعارات داخلية (جرس + polling 30s)
- ✅ محادثة فورية (Socket.io: رسائل، typing indicator، online status)
- ✅ لوحة إدارة (إحصاءات شاملة + مراجعة طلبات التوثيق)
- ✅ دعم اللغتين (عربي RTL + فرنسي)
- ✅ وضع مظلم/مضيء
