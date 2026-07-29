// core/components/SiteFooter.jsx
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__cta">
        <div className="site-footer__cta-text">
          <span className="site-footer__cta-icon">🎧</span>
          <div>
            <h3>نحن هنا لمساعدتك!</h3>
            <p>فريقنا جاهز لدعمك في رحلتك الصحية — منصة PulmoHTapAlgérie في خدمتك.</p>
          </div>
        </div>
        <Link to="/register" className="btn btn-white">ابدأ الآن ←</Link>
      </div>

      <div className="site-footer__bottom">
        <div className="site-brand site-brand--footer">
          <span className="site-brand__icon">🫁</span>
          <span className="site-brand__text">
            <strong>PulmoHTapAlgérie</strong>
            <small>منصة متكاملة لمتابعة ارتفاع ضغط الدم الرئوي</small>
          </span>
        </div>
        <p className="site-footer__copy">© {new Date().getFullYear()} PulmoHTapAlgérie — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
