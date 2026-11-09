import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

const navigation = [
  { label: 'Our mission', href: '#mission' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For partners', href: '#partners' },
];

function BrandMark() {
  return (
    <Link className="group inline-flex items-center gap-3" to="/" aria-label="FoodSurplus home">
      <span className="grid size-10 place-items-center rounded-2xl bg-forest-700 text-paper shadow-sm transition group-hover:bg-forest-800">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="size-6" fill="none">
          <path d="M16 26.5V14.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 17.2c-6.3 0-9.5-3.3-9.5-9.7 6.4 0 9.6 3.2 9.5 9.7Z" fill="currentColor" opacity=".92" />
          <path d="M16 21c0-5.7 3.1-8.7 9.4-8.7 0 6.2-3.1 9.2-9.4 9.2" fill="currentColor" opacity=".68" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-forest-900 sm:text-[1.35rem]">
        FoodSurplus<span className="text-forest-500">.</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-forest-900/5 bg-paper/95 backdrop-blur-sm">
      <div className="container-page flex min-h-[4.75rem] items-center justify-between gap-4 py-3">
        <BrandMark />

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#partners" size="small">
            Find your place
          </Button>
        </div>

        <button
          type="button"
          className="inline-grid size-11 place-items-center rounded-xl border border-forest-900/10 text-forest-900 transition hover:bg-sage-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2 md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? 'grid' : 'hidden'} gap-1 border-t border-forest-900/5 bg-paper px-5 pb-5 pt-3 md:hidden`}
      >
        {navigation.map((item) => (
          <a key={item.href} className="mobile-nav-link" href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <Button href="#partners" className="mt-2 w-full" onClick={closeMenu}>
          Find your place
        </Button>
      </nav>
    </header>
  );
}
