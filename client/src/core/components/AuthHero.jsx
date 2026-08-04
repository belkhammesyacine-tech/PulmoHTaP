// core/components/AuthHero.jsx
export default function AuthHero({ 
  title = 'PulmoHTapAlgérie', 
  subtitle = 'منصة متكاملة لمتابعة مرضى ارتفاع ضغط الدم الرئوي في الجزائر' 
}) {
  return (
    <div className="auth-hero">
      <div className="auth-hero__overlay" />
      <div className="auth-hero__content">
        
        {/* تم حظر الإيموجي وإجبار عرض صورة اللوجو دائماً */}
        <div className="auth-hero__logo flex justify-center items-center mb-4">
          <img 
            src="/pulmoHTap-LOGO.png" 
            alt="PulmoHTap Logo" 
            className="h-24 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
          />
        </div>

        <h2 className="auth-hero__title">{title}</h2>
        <p className="auth-hero__subtitle">{subtitle}</p>

        <ul className="auth-hero__features">
          <li><span>🛡️</span> جودة موثوقة — معايير أمنية دولية</li>
          <li><span>🔬</span> متابعة طبية — بنية تحتية موحدة</li>
          <li><span>❤️</span> رعاية المريض — أولويتنا</li>
        </ul>

      </div>
    </div>
  );
}