const baseStyles =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55';

export default function Button({ href, size = 'default', className = '', children, ...props }) {
  const sizeStyles = size === 'small' ? 'min-h-10 px-5 py-2.5 text-[0.8125rem]' : '';
  const classes = `${baseStyles} ${sizeStyles} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
