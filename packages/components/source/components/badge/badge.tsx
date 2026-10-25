import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

/** Apariencia visual de la insignia. */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/** Tamaños disponibles para la insignia. */
export type BadgeSize = 'small' | 'medium';

/** Propiedades de {@link Badge}, además de los atributos nativos de `span`. */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Texto, iconos u otro contenido en línea. */
  children?: ReactNode;
  /** Apariencia visual. Por defecto, `default`. */
  variant?: BadgeVariant;
  /** Tamaño. Por defecto, `medium`. */
  size?: BadgeSize;
};

/** Renderiza una etiqueta en línea no interactiva. */
export function Badge({
  children,
  className,
  size = 'medium',
  variant = 'default',
  ...props
}: BadgeProps) {
  const classes = [
    'notable-badge',
    `notable-badge--${variant}`,
    `notable-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  );
}
