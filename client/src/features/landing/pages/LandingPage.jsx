// features/landing/pages/LandingPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '../../../core/components/SiteHeader.jsx';
import SiteFooter from '../../../core/components/SiteFooter.jsx';
import { ACCOUNT_TYPES }    from '../../../core/constants/accountTypes.js';
import { WILAYAS }          from '../../../core/constants/wilayas.js';
import { useLang }          from '../../../core/context/LanguageContext.jsx';

// Translated account types
const ACCOUNT_TYPES_FR = [
  { value: 'PATIENT',       label: 'Patient',           icon: '🤒',  desc: 'Suivi de votre état de santé et de vos dossiers médicaux' },
  { value: 'DOCTOR',        label: 'Médecin généraliste',icon: '👨‍⚕️', desc: 'Gestion des dossiers patients et suivi clinique' },
  { value: 'SPECIALIST',    label: 'Médecin spécialiste',icon: '🩺',  desc: 'Spécialisations en pneumologie et cardiologie' },
  { value: 'LABORATORY',    label: 'Laboratoire',        icon: '🔬',  desc: 'Publication des résultats d\'analyses' },
  { value: 'PHARMACY',      label: 'Pharmacie',          icon: '💊',  desc: 'Gestion des ordonnances et médicaments' },
  { value: 'PSYCHOLOGIST',  label: 'Psychologue',        icon: '🧠',  desc: 'Soutien psychologique aux patients' },
  { value: 'RESEARCHER',    label: 'Chercheur',          icon: '📚',  desc: 'Recherche scientifique et études cliniques' },
  { value: 'CLINIC_ADMIN',  label: 'Admin d\'établissement', icon: '🏥', desc: 'Gestion des établissements de santé' },
];

const FEATURES_AR = [
  { icon: '📋', title: 'التسجيل الموحد',        desc: 'حساب واحد لجميع أنواع المستخدمين مع التحقق من البريد الإلكتروني' },
  { icon: '🔐', title: 'أمان JWT',             desc: 'AccessToken (15 د) و RefreshToken (7 أيام) عبر HttpOnly Cookie' },
  { icon: '🗺️', title: '58 ولاية',             desc: 'تغطية كاملة للولايات الجزائرية في الملف الشخصي' },
  { icon: '👨‍⚕️', title: 'توثيق الأطباء',       desc: 'نظام جاهز لرفع وثائق الترخيص المهني والمراجعة' },
  { icon: '📱', title: 'إدارة الجلسات',         desc: 'مراقبة وإنهاء الجلسات النشطة من أي جهاز' },
  { icon: '📧', title: 'استعادة كلمة المرور',  desc: 'رابط آمن لإعادة التعيين مع إلغاء الجلسات القديمة' },
];

const FEATURES_FR = [
  { icon: '📋', title: 'Inscription unifiée',        desc: 'Un seul compte pour tous les types d\'utilisateurs avec vérification e-mail' },
  { icon: '🔐', title: 'Sécurité JWT',               desc: 'AccessToken (15 min) et RefreshToken (7 jours) via HttpOnly Cookie' },
  { icon: '🗺️', title: '58 Wilayas',                 desc: 'Couverture complète des wilayas algériennes dans le profil' },
  { icon: '👨‍⚕️', title: 'Vérification des médecins', desc: 'Système prêt pour télécharger des documents de licence professionnelle' },
  { icon: '📱', title: 'Gestion des sessions',       desc: 'Surveillance et clôture des sessions actives depuis n\'importe quel appareil' },
  { icon: '📧', title: 'Récupération de mot de passe', desc: 'Lien sécurisé de réinitialisation avec révocation des anciennes sessions' },
];

const STATS = [
  { value: '58',  label_ar: 'ولاية جزائرية',  label_fr: 'Wilayas',       icon: '🗺️' },
  { value: '8+',  label_ar: 'أنواع حسابات',   label_fr: 'Types de comptes', icon: '👥' },
  { value: 'JWT', label_ar: 'مصادقة آمنة',   label_fr: 'Auth sécurisée', icon: '🔒' },
  { value: 'RTL', label_ar: 'واجهة عربية',   label_fr: 'Interface AR/FR', icon: '🌐' },
];

const DOCTORS = [
  {
    name_ar: 'د. أحمد بن يوسف',
    name_fr: 'Dr. Ahmed Ben Youssef',
    spec_ar: 'طبيب رئوي',
    spec_fr: 'Pneumologue',
    wilaya_ar: 'الجزائر العاصمة',
    wilaya_fr: 'Alger',
    img: '/doctor-1.png',
  },
  {
    name_ar: 'د. فاطمة الزهراء',
    name_fr: 'Dr. Fatima Zahra',
    spec_ar: 'أخصائية قلب',
    spec_fr: 'Cardiologue',
    wilaya_ar: 'وهران',
    wilaya_fr: 'Oran',
    img: '/doctor-2.png',
  },
  {
    name_ar: 'د. كريم مصطفى',
    name_fr: 'Dr. Karim Mustapha',
    spec_ar: 'طبيب داخلية',
    spec_fr: 'Médecine interne',
    wilaya_ar: 'قسنطينة',
    wilaya_fr: 'Constantine',
    img: '/doctor-1.png',
  },
  {
    name_ar: 'د. سارة بوعلام',
    name_fr: 'Dr. Sara Boualem',
    spec_ar: 'أخصائية تنفسية',
    spec_fr: 'Spécialiste respiratoire',
    wilaya_ar: 'سطيف',
    wilaya_fr: 'Sétif',
    img: '/doctor-2.png',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [wilaya, setWilaya]           = useState('');
  const [accountType, setAccountType] = useState('');

  const onQuickStart = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (wilaya)      params.set('wilaya', wilaya);
    if (accountType) params.set('accountType', accountType);
    const qs = params.toString();
    navigate(`/register${qs ? `?${qs}` : ''}`);
  };

  const accountTypes = lang === 'fr' ? ACCOUNT_TYPES_FR : ACCOUNT_TYPES;
  const features     = lang === 'fr' ? FEATURES_FR : FEATURES_AR;

  return (
    <div className="landing">
      <SiteHeader />

      {/* ── HERO ─────────────────────────────── */}
      <section className="hero" id="home">
        <div className="hero__bg" />
        <div className="hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">{t('hero.eyebrow')}</p>
            <h1 className="hero__title">
              {t('hero.title')} —
              <span className="hero__title-accent"> {t('hero.titleAccent')}</span>
            </h1>
            <p className="hero__subtitle">{t('hero.subtitle')}</p>
            <div className="hero__badges">
              <span>{t('hero.badge1')}</span>
              <span>{t('hero.badge2')}</span>
              <span>{t('hero.badge3')}</span>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="hero__stats-card">
            {STATS.map((s) => (
              <div key={s.value} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">
                  {lang === 'fr' ? s.label_fr : s.label_ar}
                </span>
              </div>
            ))}

            {/* Doctor previews */}
            <div className="hero__doctors" style={{ gridColumn: '1 / -1' }}>
              {DOCTORS.slice(0, 2).map((d) => (
                <div key={d.name_ar} className="hero__doctor-card">
                  <img src={d.img} alt={lang === 'fr' ? d.name_fr : d.name_ar} className="hero__doctor-img" />
                  <div className="hero__doctor-info">
                    <div className="hero__doctor-name">{lang === 'fr' ? d.name_fr : d.name_ar}</div>
                    <div className="hero__doctor-role">{lang === 'fr' ? d.spec_fr : d.spec_ar}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form className="hero-search glass-card" onSubmit={onQuickStart}>
          <div className="hero-search__field">
            <label htmlFor="wilaya">{t('hero.searchWilaya')}</label>
            <select id="wilaya" className="form-input form-select" value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
              <option value="">{t('hero.searchWilayaAll')}</option>
              {WILAYAS.map((w, i) => (
                <option key={w} value={w}>{i + 1}. {w}</option>
              ))}
            </select>
          </div>
          <div className="hero-search__field">
            <label htmlFor="accountType">{t('hero.searchType')}</label>
            <select id="accountType" className="form-input form-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="">{t('hero.searchTypeAll')}</option>
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary hero-search__btn">
            {t('hero.searchBtn')}
          </button>
        </form>
      </section>

      {/* ── ABOUT ────────────────────────────── */}
      <section className="section section--about" id="about">
        <div className="section__inner section__split">
          <div className="about-visual">
            <div className="about-visual__card">
              <img src="/medical-team.png" alt="Medical Team" />
              <span className="about-visual__badge">🫁 PulmoHTapAlgérie</span>
            </div>
          </div>
          <div className="section__content">
            <p className="section__eyebrow">{t('about.eyebrow')}</p>
            <h2 className="section__title">
              {t('about.title')} —
              <span className="text-accent"> {t('about.titleAccent')}</span>
            </h2>
            <p className="section__desc">{t('about.desc')}</p>
            <Link to="/register" className="btn btn-primary btn-inline">{t('about.cta')}</Link>
          </div>
        </div>
      </section>

      {/* ── DOCTORS ──────────────────────────── */}
      <section className="section" id="doctors">
        <div className="section__inner">
          <p className="section__eyebrow" style={{ justifyContent: 'center' }}>
            {lang === 'fr' ? 'Notre équipe médicale' : 'فريقنا الطبي'}
          </p>
          <h2 className="section__title section__title--center">
            {lang === 'fr' ? 'Des experts à votre service' : 'خبراء في خدمتك'}
          </h2>
          <p className="section__desc section__desc--center">
            {lang === 'fr'
              ? 'Une équipe de médecins spécialistes couvrant les 58 wilayas algériennes'
              : 'فريق من الأطباء المتخصصين يغطي 58 ولاية جزائرية'}
          </p>
          <div className="doctors-grid">
            {DOCTORS.map((d) => (
              <article key={d.name_ar} className="doctor-card">
                <div className="doctor-card__img-wrap">
                  <img src={d.img} alt={lang === 'fr' ? d.name_fr : d.name_ar} />
                </div>
                <div className="doctor-card__body">
                  <div className="doctor-card__name">{lang === 'fr' ? d.name_fr : d.name_ar}</div>
                  <div className="doctor-card__spec">{lang === 'fr' ? d.spec_fr : d.spec_ar}</div>
                  <div className="doctor-card__wilaya">📍 {lang === 'fr' ? d.wilaya_fr : d.wilaya_ar}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCOUNT TYPES ───────────────────── */}
      <section className="section section--alt" id="accounts">
        <div className="section__inner">
          <h2 className="section__title section__title--center">{t('accounts.title')}</h2>
          <p className="section__desc section__desc--center">{t('accounts.desc')}</p>
          <div className="cards-grid cards-grid--4">
            {accountTypes.map((type) => (
              <article key={type.value} className="feature-card">
                <span className="feature-card__icon">{type.icon}</span>
                <h3 className="feature-card__title">{type.label}</h3>
                <p className="feature-card__desc">{type.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────── */}
      <section className="stats-bar">
        <div className="stats-bar__inner">
          <div className="stats-bar__intro">
            <h2>{t('stats.title')}</h2>
            <p>{t('stats.subtitle')}</p>
          </div>
          <div className="stats-bar__grid">
            {STATS.map((stat) => (
              <div key={stat.value} className="stat-item">
                <span className="stat-item__icon">{stat.icon}</span>
                <strong className="stat-item__value">{stat.value}</strong>
                <span className="stat-item__label">{lang === 'fr' ? stat.label_fr : stat.label_ar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────── */}
      <section className="section" id="services">
        <div className="section__inner">
          <h2 className="section__title section__title--center">{t('services.title')}</h2>
          <p className="section__desc section__desc--center">{t('services.desc')}</p>
          <div className="cards-grid cards-grid--3">
            {features.map((f) => (
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
