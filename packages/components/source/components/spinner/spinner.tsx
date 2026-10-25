import { LoaderCircle } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import './spinner.css';

/** Tamaños disponibles para el indicador de carga. */
export type SpinnerSize = 'small' | 'medium' | 'large';

/** Propiedades de {@link Spinner}, además de los atributos nativos de `span`. */
export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Clase CSS adicional del elemento de estado. */
  className?: string;
  /** Nombre accesible del estado. Por defecto, `Loading`; `aria-label` tiene prioridad. */
  label?: string;
  /** Tamaño del indicador. Por defecto, `medium`. */
  size?: SpinnerSize;
};

/** Renderiza un icono de carga decorativo dentro de un elemento de estado accesible. */
export function Spinner({
  className,
  label = 'Loading',
  size = 'medium',
  'aria-label': ariaLabel,
  ...props
}: SpinnerProps) {
  const classes = ['notable-spinner', `notable-spinner--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      {...props}
      className={classes}
      role="status"
      aria-label={ariaLabel ?? label}
    >
      <LoaderCircle className="notable-spinner__icon" aria-hidden="true" />
    </span>
  );
}
