# PulmoHTapAlgérie — PROJECT_MAP.md

> **حالة النظام الحالية**: نظام الحسابات الموحد (Infrastructure Centrale) مكتمل ومؤسس بالكامل.

---

## [TECH_STACK]
- **Frontend**: React `19.2.8` + Vite `8.1.5` + React Router DOM `7.18.1` + Tailwind CSS v4
- **Backend**: Node.js `v24.18.0` + Express `5.2.1`
- **ORM & Database**: Prisma `7.9.0` + PostgreSQL (Supabase)
- **Security & Auth**: JWT (`jsonwebtoken` `9.0.3`) + `bcryptjs` `3.0.3` + `helmet` `8.3.0` + `express-rate-limit` `8.6.1`
- **Validation**: Zod `4.4.3`
- **Logging**: Pino (Async non-blocking)
- **Email**: Nodemailer `9.0.3` (Gmail SMTP HTML RTL)

---

## [SYSTEM_FLOW]
1. **التسجيل (`POST /api/auth/register`)**: التحقق من البيانات بـ Zod -> التشفير بـ bcrypt -> إنشاء الحساب بحالة PENDING -> إرسال بريد تفعيل RTL -> حفظ سجل التدقيق AuditLog.
2. **التحقق من البريد (`GET /api/auth/verify-email`)**: التثبت من الرمز وصلاحيته -> تحويل الحالة إلى ACTIVE -> إتاحة الدخول.
3. **تسجيل الدخول (`POST /api/auth/login`)**: مطابقة الاعتمادات بشكل آمن من الهجمات الزمانية -> إصدار AccessToken (15m) و RefreshToken (7d) ممرر عبر HttpOnly Cookie.
4. **تجديد الجلسة (`POST /api/auth/refresh`)**: تجديد تلقائي آمن دون مقاطعة المستخدم عند انتهاء AccessToken.
5. **استعادة كلمة المرور (`POST /api/auth/forgot-password` & `reset-password`)**: حماية الحسابات من الفحص -> إرسال رابط آمن -> إعادة تعيين كلمة المرور وإلغاء جميع الجلسات القديمة.
6. **إدارة الجلسات والملف الشخصي (`/api/users/me`)**: تحديث بيانات 58 ولاية جزائرية، إنهاء الجلسات المحددة أو جميع الجلسات الأخرى.
7. **توثيق الأطباء (`DoctorVerification`)**: هيكل جاهز لرفع المراجعات والوثائق المهنية للأطباء والمختصين.

---

## [ARCHITECTURE]
```
PulmoHTaP4/
├── server/
│   ├── prisma/
│   │   └── schema.prisma        (User, UserProfile, Session, EmailVerification, PasswordReset, DoctorVerification, AuditLog, Wilaya [58])
│   └── src/
│       ├── core/                (prisma, token, email, logger, AppError, authenticate, validate, rateLimiter)
│       └── features/
│           ├── auth/            (schema, service, controller, routes)
│           └── users/           (service, controller, routes)
└── client/
    └── src/
        ├── core/
        │   ├── components/      (SiteHeader, SiteFooter, AuthHero, DashboardNav)
        │   ├── constants/       (accountTypes, wilayas)
        │   ├── client.js, AuthContext, AppRouter
        └── features/
            ├── landing/         (LandingPage — صفحة رئيسية طبية RTL)
            └── auth/            (LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, DashboardPage, ProfilePage, SessionsPage)
```

---

## [ORPHANS & PENDING]
- `[x]` ~~إضافة كلمة سر قاعدة بيانات Supabase النهائية ورمز Gmail App Password في ملف `.env`.~~ (مكتمل)
- `[ ]` تفعيل رفع وثائق الأطباء (Doctor Verification file upload UI) عند بناء وحدة المطبّة المتقدمة.

## [UI_DESIGN]
- **الثيم**: Teal طبي (#0d9488) — glassmorphism — RTL عربي
- **الصفحة الرئيسية** (`/`): Hero + شريط بحث سريع (ولاية/نوع حساب) + من نحن + أنواع الحسابات + إحصائيات + خدمات + Footer CTA
- **المسارات**: `/` عامة | `/login` `/register` ضيف | `/dashboard` `/profile` `/sessions` محمية
