// core/components/AuthHero.jsx — Shared Auth Hero Panel with Real Logo
export default function AuthHero({ title, subtitle }) {
  return (
    <div className="auth-hero">
      <div className="auth-hero__overlay" />
      <div className="auth-hero__content">
        <div className="auth-hero__logo-wrap">
          <img
            src="/pulmoHTap-LOGO.png"
            alt="PulmoHTap Logo"
            className="auth-hero__logo-img"
          />
        </div>

        {title && <h2 className="auth-hero__title">{title}</h2>}
        {subtitle && <p className="auth-hero__subtitle">{subtitle}</p>}

        {!title && (
          <>
            <h2 className="auth-hero__title">PulmoHTapAlgérie</h2>
            <p className="auth-hero__subtitle">
              منصة متكاملة لمتابعة مرضى ارتفاع ضغط الدم الرئوي في الجزائر
            </p>
            <ul className="auth-hero__features">
              <li><span>✅</span> هوية موحدة لجميع المستخدمين</li>
              <li><span>🔒</span> حماية أمنية متقدمة</li>
              <li><span>🏥</span> 58 ولاية جزائرية</li>
              <li><span>👨‍⚕️</span> توثيق الأطباء والمختصين</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
