export interface LogoProps {
  className?: string;
}

/** Renders the One brand mark in the current text color. */
export function Logo({ className }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      className={className ? `site-logo ${className}` : 'site-logo'}
    />
  );
}
