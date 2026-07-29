// core/components/AuthHero.jsx — Hero panel for auth pages
export default function AuthHero({ icon = '🫁', title = 'PulmoHTapAlgérie', subtitle = 'منصة متكاملة لمتابعة مرضى ارتفاع ضغط الدم الرئوي في الجزائر' }) {
  return (
    <div className="auth-hero">
      <div className="auth-hero__overlay" />
      <div className="auth-hero__content">
        <div className="auth-hero__logo">{icon}</div>
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
