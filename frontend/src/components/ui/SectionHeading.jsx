export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-2xl ${alignment} ${className}`.trim()}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title mt-3">{title}</h2>
      {description ? <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">{description}</p> : null}
    </div>
  );
}
