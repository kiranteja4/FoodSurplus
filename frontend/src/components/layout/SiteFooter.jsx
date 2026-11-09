import { Link } from 'react-router-dom';
import ApiHealthStatus from '../ui/ApiHealthStatus.jsx';
import Container from '../ui/Container.jsx';

export default function SiteFooter() {
  return (
    <footer className="border-t border-forest-900/10 bg-paper">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 sm:items-start lg:grid-cols-[1.3fr_.7fr_1fr] lg:py-16">
        <div>
          <Link className="font-display text-xl font-semibold tracking-tight text-forest-900" to="/">
            FoodSurplus<span className="text-forest-500">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-muted">
            Less waste. More nourishment. Stronger communities.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="grid justify-start gap-3 text-sm">
          <a className="footer-link" href="#mission">Our mission</a>
          <a className="footer-link" href="#how-it-works">How it works</a>
          <a className="footer-link" href="#partners">For partners</a>
        </nav>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Service status
          </p>
          <ApiHealthStatus />
        </div>

        <div className="border-t border-forest-900/10 pt-5 text-xs leading-5 text-ink-muted sm:col-span-2 lg:col-span-3">
          <p>FoodSurplus is in development. Publishing and claiming food are not available yet.</p>
          <p className="mt-2">© {new Date().getFullYear()} FoodSurplus. Built to help good food go further.</p>
        </div>
      </Container>
    </footer>
  );
}
