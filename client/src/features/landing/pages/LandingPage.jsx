// features/landing/pages/LandingPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '../../../core/components/SiteHeader.jsx';
import SiteFooter from '../../../core/components/SiteFooter.jsx';
import { ACCOUNT_TYPES } from '../../../core/constants/accountTypes.js';
import { WILAYAS } from '../../../core/constants/wilayas.js';

const FEATURES = [
  { icon: '📋', title: 'التسجيل الموحد', desc: 'حساب واحد لجميع أنواع المستخدمين مع التحقق من البريد الإلكتروني' },
  { icon: '🔐', title: 'أمان JWT', desc: 'AccessToken (15 د) و RefreshToken (7 أيام) عبر HttpOnly Cookie' },
  { icon: '🗺️', title: '58 ولاية', desc: 'تغطية كاملة للولايات الجزائرية في الملف الشخصي' },
  { icon: '👨‍⚕️', title: 'توثيق الأطباء', desc: 'نظام جاهز لرفع وثائق الترخيص المهني والمراجعة' },
  { icon: '📱', title: 'إدارة الجلسات', desc: 'مراقبة وإنهاء الجلسات النشطة من أي جهاز' },
  { icon: '📧', title: 'استعادة كلمة المرور', desc: 'رابط آمن لإعادة التعيين مع إلغاء الجلسات القديمة' },
];

const STATS = [
  { value: '58', label: 'ولاية جزائرية', icon: '🗺️' },
  { value: '8+', label: 'أنواع حسابات', icon: '👥' },
  { value: 'JWT', label: 'مصادقة آمنة', icon: '🔒' },
  { value: 'RTL', label: 'واجهة عربية', icon: '🌐' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [wilaya, setWilaya] = useState('');
  const [accountType, setAccountType] = useState('');

  const onQuickStart = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (wilaya) params.set('wilaya', wilaya);
    if (accountType) params.set('accountType', accountType);
    const qs = params.toString();
    navigate(`/register${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="landing">
      <SiteHeader />

      <section className="hero" id="home">
        <div className="hero__bg" />
        <div className="hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">PulmoHTapAlgérie</p>
            <h1 className="hero__title">
              صحتك أولويتنا —
              <span className="hero__title-accent"> مستقبل أفضل</span>
            </h1>
            <p className="hero__subtitle">
              منصة متكاملة لمتابعة مرضى ارتفاع ضغط الدم الرئوي في الجزائر
            </p>
            <div className="hero__badges">
              <span>🛡️ جودة موثوقة</span>
              <span>🔬 متابعة طبية ذكية</span>
              <span>❤️ رعاية المريض أولاً</span>
            </div>
          </div>
        </div>

        <form className="hero-search glass-card" onSubmit={onQuickStart}>
          <div className="hero-search__field">
            <label htmlFor="wilaya">الولاية</label>
            <select id="wilaya" className="form-input form-select" value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
              <option value="">جميع الولايات (58)</option>
              {WILAYAS.map((w, i) => (
                <option key={w} value={w}>{i + 1}. {w}</option>
              ))}
            </select>
          </div>
          <div className="hero-search__field">
            <label htmlFor="accountType">نوع الحساب</label>
            <select id="accountType" className="form-input form-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="">جميع الأنواع</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary hero-search__btn">ابدأ الآن</button>
        </form>
      </section>

      <section className="section section--about" id="about">
        <div className="section__inner section__split">
          <div className="about-visual">
            <div className="about-visual__card">
              {/* اللوجو المضيء بدلاً من إيموجي الرئة */}
              <img 
                src="/pulmoHTap-LOGO.png" 
                alt="PulmoHTap Logo" 
                className="h-20 w-auto mx-auto mb-2 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
              />
              <p>ارتفاع ضغط الدم الرئوي</p>
            </div>
          </div>
          <div className="section__content">
            <p className="section__eyebrow">من نحن</p>
            <h2 className="section__title">
              ملتزمون بالجودة —
              <span className="text-accent"> مكرّسون للحياة</span>
            </h2>
            <p className="section__desc">
              PulmoHTapAlgérie هي البنية التحتية الموحدة لمتابعة مرضى ارتفاع ضغط الدم الرئوي.
              نوفر نظام حسابات متكامل يربط المرضى والأطباء والمختبرات والصيدليات والباحثين
              في منصة واحدة آمنة، مع دعم كامل للغة العربية و58 ولاية جزائرية.
            </p>
            <Link to="/register" className="btn btn-primary btn-inline">اعرف المزيد ←</Link>
          </div>
        </div>
      </section>

      <section className="section" id="accounts">
        <div className="section__inner">
          <h2 className="section__title section__title--center">أنواع الحسابات</h2>
          <p className="section__desc section__desc--center">
            انضم كمريض، طبيب، مختص، مخبر، صيدلية، أخصائي نفسي، باحث، أو مسؤول مؤسسة صحية
          </p>
          <div className="cards-grid cards-grid--4">
            {ACCOUNT_TYPES.map((type) => (
              <article key={type.value} className="feature-card">
                <span className="feature-card__icon">{type.icon}</span>
                <h3 className="feature-card__title">{type.label}</h3>
                <p className="feature-card__desc">{type.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stats-bar__inner">
          <div className="stats-bar__intro">
            <h2>لماذا PulmoHTapAlgérie؟</h2>
            <p>بنية تحتية موحدة — جاهزة للوحدات الطبية القادمة</p>
          </div>
          <div className="stats-bar__grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-item__icon">{stat.icon}</span>
                <strong className="stat-item__value">{stat.value}</strong>
                <span className="stat-item__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" id="services">
        <div className="section__inner">
          <h2 className="section__title section__title--center">الخدمات المتاحة</h2>
          <p className="section__desc section__desc--center">
            نظام الحسابات الموحد مكتمل — الوحدات الطبية القادمة ستعتمد على هويتك الحالية فوراً
          </p>
          <div className="cards-grid cards-grid--3">
            {FEATURES.map((f) => (
              <article key={f.title} className="service-card">
                <span className="service-card__icon">{f.icon}</span>
                <h3 className="service-card__title">{f.title}</h3>
                <p className="service-card__desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}