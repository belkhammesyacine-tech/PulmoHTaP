// core/lib/email.js — Nodemailer SMTP transport
import nodemailer from 'nodemailer';
import { logger } from './logger.js';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
const FROM = process.env.EMAIL_FROM ?? 'PulmoHTapAlgérie <noreply@example.com>';

// ── Helpers ────────────────────────────────────

function baseTemplate(title, content) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7fb; margin:0; padding:0; }
    .container { max-width:560px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
    .header { background:linear-gradient(135deg,#1a73e8,#0d47a1); padding:32px 24px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:22px; }
    .header p { color:#90caf9; margin:6px 0 0; font-size:13px; }
    .body { padding:32px 28px; color:#333; line-height:1.7; }
    .body h2 { font-size:18px; margin-top:0; }
    .btn { display:inline-block; margin:24px 0; padding:14px 32px; background:#1a73e8; color:#fff; text-decoration:none; border-radius:8px; font-size:15px; font-weight:600; }
    .footer { background:#f0f4ff; padding:16px 24px; text-align:center; font-size:12px; color:#888; }
    .code { display:inline-block; font-size:32px; font-weight:700; letter-spacing:8px; color:#1a73e8; padding:12px 24px; background:#e8f0fe; border-radius:8px; margin:16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🫁 PulmoHTapAlgérie</h1>
      <p>منصة متابعة ارتفاع ضغط الدم الرئوي</p>
    </div>
    <div class="body">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">هذا البريد أُرسل تلقائياً — لا تردّ عليه</div>
  </div>
</body>
</html>`;
}

// ── Public API ─────────────────────────────────

export async function sendVerificationEmail(to, token) {
  const link = `${CLIENT_URL}/verify-email?token=${token}`;
  const html = baseTemplate('تفعيل حسابك', `
    <p>مرحباً! شكراً لتسجيلك في منصة PulmoHTapAlgérie.</p>
    <p>اضغط على الزر أدناه لتفعيل حسابك. الرابط صالح لمدة <strong>24 ساعة</strong>.</p>
    <a class="btn" href="${link}">تفعيل الحساب</a>
    <p style="color:#888;font-size:13px;">إذا لم تنشئ حساباً، تجاهل هذا البريد.</p>
  `);
  await _send(to, 'تفعيل حسابك في PulmoHTapAlgérie', html);
}

export async function sendPasswordResetEmail(to, token) {
  const link = `${CLIENT_URL}/reset-password?token=${token}`;
  const html = baseTemplate('إعادة تعيين كلمة المرور', `
    <p>تلقّينا طلباً لإعادة تعيين كلمة مرور حسابك.</p>
    <p>اضغط على الزر أدناه. الرابط صالح لمدة <strong>ساعة واحدة</strong>.</p>
    <a class="btn" href="${link}">إعادة تعيين كلمة المرور</a>
    <p style="color:#888;font-size:13px;">إذا لم تطلب ذلك، تجاهل هذا البريد.</p>
  `);
  await _send(to, 'إعادة تعيين كلمة المرور — PulmoHTapAlgérie', html);
}

async function _send(to, subject, html) {
  try {
    await transport.sendMail({ from: FROM, to, subject, html });
    logger.info({ action: 'EMAIL_SENT', to, subject });
  } catch (err) {
    logger.error({ action: 'EMAIL_FAILED', to, subject, err: err.message });
    throw err;
  }
}
