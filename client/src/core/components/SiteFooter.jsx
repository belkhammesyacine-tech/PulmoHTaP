// core/components/SiteFooter.jsx
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

export default function SiteFooter() {
  const { lang, t } = useLang();

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__cta">
        <div className="site-footer__cta-text">
          <span className="site-footer__cta-icon">🎧</span>
          <div>
            <h3>
              {lang === 'fr' ? 'Nous sommes là pour vous aider!' : 'نحن هنا لمساعدتك!'}
            </h3>
            <p>
              {lang === 'fr' 
                ? 'Notre équipe est prête à vous accompagner dans votre parcours de santé — la plateforme PulmoHTapAlgérie est à votre service.' 
                : 'فريقنا جاهز لدعمك في رحلتك الصحية — منصة PulmoHTapAlgérie في خدمتك.'}
            </p>
          </div>
        </div>
        <Link to="/register" className="btn btn-white">
          {lang === 'fr' ? 'Commencer maintenant →' : 'ابدأ الآن ←'}
        </Link>
      </div>

      <div className="site-footer__bottom">
        <div className="site-brand site-brand--footer">
          <span className="site-brand__icon">
            <img src="/pulmoHTap-LOGO.png" alt="PulmoHTap Logo" />
          </span>
          <span className="site-brand__text">
            <strong>PulmoHTapAlgérie</strong>
            <small>
              {lang === 'fr' 
                ? 'Plateforme intégrée pour le suivi de l\'hypertension pulmonaire' 
                : 'منصة متكاملة لمتابعة ارتفاع ضغط الدم الرئوي'}
            </small>
          </span>
        </div>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} PulmoHTapAlgérie — {lang === 'fr' ? 'Tous droits réservés' : 'جميع الحقوق محفوظة'}
        </p>
      </div>
    </footer>
  );
}
