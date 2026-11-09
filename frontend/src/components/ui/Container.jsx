export default function Container({ as: Element = 'div', className = '', ...props }) {
  return <Element className={`container-page ${className}`.trim()} {...props} />;
}
