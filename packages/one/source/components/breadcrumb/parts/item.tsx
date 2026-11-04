import type { BreadcrumbItemProps } from '../types.js';

export function BreadcrumbItem({
  href,
  current,
  children,
}: BreadcrumbItemProps) {
  if (current) {
    return (
      <span className="one-breadcrumb__current" aria-current="page">
        {children}
      </span>
    );
  }

  if (href === undefined) {
    return <span className="one-breadcrumb__text">{children}</span>;
  }

  return (
    <a className="one-breadcrumb__link" href={href}>
      {children}
    </a>
  );
}
