import { footer } from '../data/content';

export default function Footer() {
  return (
    <div className="wrap">
      <footer className="site-footer">
        <a href="#top" className="wordmark" aria-label="EMYNAJ, back to top">
          EMY<span>NAJ</span>
        </a>
        <span>{footer.text}</span>
        <a href="#top" className="to-top" aria-label="Back to top">
          ↑
        </a>
      </footer>
    </div>
  );
}
