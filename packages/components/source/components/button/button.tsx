import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import './button.css';

/** Apariencia visual del botón. */
export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/** Tamaños disponibles para el botón, incluidos los tamaños para iconos. */
export type ButtonSize =
  'small' | 'medium' | 'large' | 'icon' | 'icon-small' | 'icon-large';

/** Propiedades de {@link Button}, incluidas las propiedades de Motion. */
export type ButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'disabled' | 'children'
> & {
  /** Contenido del botón. Los botones de solo icono necesitan un nombre accesible. */
  children?: ReactNode;
  /** Apariencia visual. Por defecto, `primary`. */
  variant?: ButtonVariant;
  /** Tamaño del botón. Por defecto, `medium`. */
  size?: ButtonSize;
  /** Desactiva el botón y sus animaciones de interacción. Por defecto, `false`. */
  disabled?: boolean;
};

/**
 * Renderiza un botón nativo con animaciones opcionales al pasar el cursor o pulsarlo.
 * Respeta la preferencia de movimiento reducido y usa `button` como `type` predeterminado.
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  children,
  whileHover,
  whileTap,
  transition,
  type = 'button',
  ...props
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMotionDisabled = disabled || shouldReduceMotion;

  const classes = [
    'notable-button',
    `notable-button--${variant}`,
    `notable-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      {...props}
      type={type}
      disabled={disabled}
      className={classes}
      whileHover={
        isMotionDisabled ? undefined : (whileHover ?? { scale: 1.03 })
      }
      whileTap={isMotionDisabled ? undefined : (whileTap ?? { scale: 0.97 })}
      transition={
        transition ?? {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }
      }
    >
      <span className="notable-button__content">{children}</span>
    </motion.button>
  );
}
