# دليل التثبيت الشامل (Installation Guide)

## 1. المتطلبات الأساسية
- Node.js إصدار 18+
- حساب على Supabase أو قاعدة بيانات PostgreSQL محلية.

## 2. استنساخ وتثبيت المشروع
قم بفتح مسار المشروع في الطرفية وتشغيل الأمر التالي لتثبيت جميع الحزم (الخادم والعميل):
```bash
npm install
cd client && npm install
cd ../server && npm install
```

## 3. إعداد متغيرات البيئة
في مجلد `server`، قم بإنشاء ملف `.env` وقم بوضع الروابط والمفاتيح:
```env
DATABASE_URL="postgres://user:pass@host:5432/db"
DIRECT_URL="postgres://user:pass@host:5432/db"
PORT=5000
NODE_ENV="development"
JWT_SECRET="YOUR_SECRET_KEY"
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRET"
CLIENT_URL="http://localhost:5173"
RESEND_API_KEY="re_..."
```

## 4. إعداد قاعدة البيانات (Prisma)
داخل مجلد `server`، نفذ الأوامر التالية لمزامنة قاعدة البيانات:
```bash
npx prisma db push
npx prisma generate
```

## 5. التشغيل
لتشغيل كل من الخادم والعميل في وقت واحد (أثناء التطوير)، افتح مسار المشروع الجذري وشغّل:
```bash
npm run dev
```

سيتم تشغيل:
- العميل (Frontend) على `http://localhost:5173` (أو منفذ مشابه كـ 5178).
- الخادم (Backend) على `http://localhost:5000`.
