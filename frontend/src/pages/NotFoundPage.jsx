import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[55vh] place-items-center py-16">
      <Container className="text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-forest-950">That path is not here.</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink-muted">
          This page may have moved, or it may not be part of FoodSurplus yet.
        </p>
        <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2" to="/">
          Return home
        </Link>
      </Container>
    </section>
  );
}
