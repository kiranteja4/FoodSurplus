import Button from '../../components/ui/Button.jsx';
import Container from '../../components/ui/Container.jsx';
import SectionHeading from '../../components/ui/SectionHeading.jsx';

const steps = [
  {
    number: '01',
    title: 'Share what is available',
    description: 'Food donors describe surplus clearly, including how it was prepared, stored and when it can be collected.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="size-7">
        <path d="M8 10.5h16M10 10.5V25h12V10.5M13 10.5V7h6v3.5M13 15v6M19 15v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Connect with local NGOs',
    description: 'Verified community organizations can find food that fits their capacity and coordinate a suitable collection.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="size-7">
        <path d="M7 24.5h18M10 24.5v-8l6-4 6 4v8M13 24.5v-5h6v5M8 10.5h6M11 7.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get good food where it helps',
    description: 'Clear handoffs and collection details help organizations move surplus onward with care and accountability.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="size-7">
        <path d="M7 17.5c4.5 0 5.5-5 9-5s4.5 5 9 5M9 18v6.5h14V18M13 24.5v-4h6v4M16 5.5v5M13.5 8l2.5 2.5L18.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function ProduceIllustration() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art-glow" />
      <div className="art-note art-note-top">
        <span className="art-note-icon">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.3s-7.4-4.4-7.4-10a4 4 0 0 1 7.4-2.1 4 4 0 0 1 7.4 2.1c0 5.6-7.4 10-7.4 10Z" />
          </svg>
        </span>
        <span><strong>Good food,</strong><br />with somewhere to go.</span>
      </div>
      <div className="produce-window">
        <div className="produce-window-top">
          <span className="produce-kicker">A little goes a long way</span>
          <span className="produce-sun" />
        </div>
        <svg className="produce-illustration" viewBox="0 0 440 340" fill="none">
          <ellipse cx="220" cy="287" rx="159" ry="23" fill="#dbe7d8" />
          <path d="M93 196c12-56 68-92 127-92s115 36 127 92l-25 56H118l-25-56Z" fill="#b97847" />
          <path d="M102 194c21 22 55 34 118 34s97-12 118-34" stroke="#8c5537" strokeWidth="9" strokeLinecap="round" />
          <path d="M114 220c29 17 63 25 106 25s77-8 106-25" stroke="#d39a65" strokeWidth="7" strokeLinecap="round" />
          <path d="M128 246h184l-13 29H141l-13-29Z" fill="#a5673e" />
          <path d="M153 144c-17-35-5-71 31-83 18 35 6 70-31 83Z" fill="#628b62" />
          <path d="M155 138c9-27 19-46 30-63" stroke="#d8e4c8" strokeWidth="3" strokeLinecap="round" />
          <path d="M197 126c-6-38 17-67 58-70 6 39-17 68-58 70Z" fill="#789b68" />
          <path d="M202 119c20-25 35-42 51-56" stroke="#e1e9d1" strokeWidth="3" strokeLinecap="round" />
          <path d="M249 142c4-36 34-56 72-45-4 38-34 57-72 45Z" fill="#9cac68" />
          <path d="M254 137c20-18 38-29 60-37" stroke="#edf0d6" strokeWidth="3" strokeLinecap="round" />
          <path d="M157 175c-13-22-4-45 19-53 13 23 5 45-19 53Z" fill="#8aaa6a" />
          <path d="M268 183c-3-27 16-45 43-41 3 27-16 45-43 41Z" fill="#769760" />
          <path d="M175 176c-4-25 13-43 39-40 4 26-13 43-39 40Z" fill="#dfaa58" />
          <path d="M182 170c12-14 20-21 31-28" stroke="#f2d9a6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="244" cy="168" r="25" fill="#c86f4e" />
          <path d="M238 144c3-8 9-12 17-12" stroke="#567c50" strokeWidth="5" strokeLinecap="round" />
          <circle cx="235" cy="162" r="4" fill="#e99a72" />
          <path d="M294 168c-11-23-1-44 23-51 11 23 1 44-23 51Z" fill="#567c50" />
          <path d="M298 161c7-17 13-28 21-37" stroke="#d7e1c4" strokeWidth="3" strokeLinecap="round" />
          <path d="M118 112c15-14 31-17 48-7-8 18-24 22-48 7Z" fill="#b9c584" />
          <path d="M128 112h27" stroke="#eef0d2" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M305 105c10-17 27-22 45-12-4 20-20 26-45 12Z" fill="#89a876" />
          <path d="M312 104h28" stroke="#e5ebd3" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="produce-caption">
          <span className="caption-dot" />
          <span>Food shared with care</span>
        </div>
      </div>
      <div className="art-note art-note-bottom">
        <span className="art-sparkle">✳</span>
        <span><strong>Less waste.</strong><br />More nourishment.</span>
      </div>
      <span className="art-orbit art-orbit-one" />
      <span className="art-orbit art-orbit-two" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-8">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/70 px-3.5 py-2 text-xs font-semibold tracking-wide text-forest-800 shadow-sm">
              <span className="size-2 rounded-full bg-earth-500" />
              A better path for surplus food
            </p>
            <h1 className="mt-7 max-w-xl font-display text-[clamp(3.2rem,7.5vw,5.7rem)] font-semibold leading-[.98] tracking-tight text-forest-950">
              Good food can <span className="text-forest-600">go further.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
              FoodSurplus is being built to help food donors connect with local organizations and give edible surplus a meaningful next destination.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#how-it-works">
                See how it could work
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 10h13m-5-5 5 5-5 5" />
                </svg>
              </Button>
              <a className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-forest-800 transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2" href="#mission">
                Why we are building this
              </a>
            </div>
            <p className="mt-7 flex items-start gap-2 text-xs leading-5 text-ink-muted sm:text-sm">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-forest-600" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2.5 17 5v4.6c0 4.2-2.8 6.7-7 8-4.2-1.3-7-3.8-7-8V5l7-2.5Z" />
                <path d="m7 9.8 2 2 4-4" />
              </svg>
              <span>Designed around clear food details, responsible handoffs and trusted local partners.</span>
            </p>
          </div>
          <ProduceIllustration />
        </Container>
      </section>

      <section id="mission" className="scroll-mt-24 bg-forest-800 py-16 text-paper sm:py-20 lg:py-24">
        <Container className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-light">The reason behind it</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              A little less wasted. A little more shared.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-paper/85">
              Good food can be left without a clear route to the people who need it. FoodSurplus is designed to make that connection easier for donors and community organizations, with the practical details that help a handoff work.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Keep food in use', 'Make surplus visible while it can still help.'],
                ['Connect nearby', 'Bring local donors and organizations closer.'],
                ['Share with care', 'Make handling and collection details clear.'],
              ].map(([title, description]) => (
                <div key={title} className="border-t border-paper/25 pt-4">
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-paper/70">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="The intended journey"
              title="A thoughtful route from surplus to community."
              description="The platform is planned around a simple idea: make it easier to offer food, find a suitable local partner and coordinate a clear collection."
            />
            <span className="mb-1 inline-flex w-fit items-center gap-2 rounded-full bg-harvest-100 px-3 py-2 text-xs font-semibold text-harvest-900">
              <span className="size-1.5 rounded-full bg-harvest-700" />
              Planned workflow
            </span>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="step-card">
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-sage-100 text-forest-700">
                    {step.icon}
                  </span>
                  <span className="font-display text-3xl font-medium tracking-tight text-sage-400">{step.number}</span>
                </div>
                <h3 className="mt-7 font-display text-2xl font-medium tracking-tight text-forest-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="partners" className="scroll-mt-24 bg-sage-100/70 py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Better together"
            title="There is room for every part of the journey."
            description="The strongest food recovery networks are built by the people who know their food and their communities best."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="partner-card">
              <div className="partner-icon bg-earth-100 text-earth-800">
                <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 14h20M8 14v12h16V14M5 14l2-7h18l2 7M12 18h8M13 26v-5h6v5M11 7l2 7m8-7-2 7" />
                </svg>
              </div>
              <p className="eyebrow mt-6">For food donors</p>
              <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-forest-950">Make surplus count.</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-ink-muted">
                Restaurants, grocers, caterers and community kitchens may have good food left at the end of a service or event. The planned donor journey makes sharing availability and collection details straightforward.
              </p>
              <a href="#how-it-works" className="inline-flex items-center gap-2 pt-5 text-sm font-semibold text-forest-800 hover:text-forest-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-4">
                Explore the planned journey
                <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="partner-card">
              <div className="partner-icon bg-forest-100 text-forest-800">
                <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.5 25.5h21M8 25.5v-9l8-5 8 5v9M13 25.5v-6h6v6M7 10.5h8M11 6.5v8" />
                </svg>
              </div>
              <p className="eyebrow mt-6">For community organizations</p>
              <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-forest-950">Bring good food closer.</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-ink-muted">
                NGOs and charitable organizations understand the needs and capacity of their communities. The planned NGO journey helps them find suitable surplus and coordinate collection with donors.
              </p>
              <a href="#how-it-works" className="inline-flex items-center gap-2 pt-5 text-sm font-semibold text-forest-800 hover:text-forest-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-4">
                Explore the planned journey
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-forest-900/10 bg-paper px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-display text-xl font-medium text-forest-950">Starting with the right foundations.</p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">FoodSurplus is in development. Publishing, claiming and partner accounts are not live yet.</p>
            </div>
            <a href="#mission" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-forest-800/20 px-5 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2">
              Read our mission
            </a>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="closing-panel">
            <span className="closing-leaf" aria-hidden="true">
              <svg viewBox="0 0 48 48" className="size-8" fill="none">
                <path d="M24 40V21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 27C12 27 7 20 7 8c12 0 18 6 17 19Z" fill="currentColor" />
                <path d="M24 33c0-11 6-17 18-17 0 12-6 18-18 18" fill="currentColor" opacity=".72" />
              </svg>
            </span>
            <p className="eyebrow eyebrow-light">Food deserves another chance</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
              Less waste. More nourishment. Stronger communities.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-paper/75 sm:text-base sm:leading-7">
              We are laying the groundwork for a more connected, considered way to share surplus food.
            </p>
            <a href="#main-content" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-forest-900 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900">
              Back to the beginning
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
