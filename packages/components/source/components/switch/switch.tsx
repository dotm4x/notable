import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './switch.css';

/** Propiedades de una casilla presentada con semántica de interruptor. */
export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  /** Texto de ayuda asociado al interruptor para tecnologías de asistencia. */
  description?: ReactNode;
  /** Mensaje de error asociado al interruptor y anunciado de forma no intrusiva. */
  error?: ReactNode;
  /** Marca el interruptor como no válido aunque no se muestre un error. */
  invalid?: boolean;
  /** Etiqueta visible asociada al interruptor. */
  label?: ReactNode;
};

/**
 * Renderiza una casilla nativa con `role="switch"` y etiqueta, descripción
 * y error opcionales. Reenvía la referencia al campo nativo.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    className,
    description,
    error,
    id,
    invalid = false,
    label,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const descriptionId = description ? `${switchId}-description` : undefined;
  const errorId = error ? `${switchId}-error` : undefined;
  const isInvalid =
    invalid ||
    Boolean(error) ||
    (ariaInvalid !== undefined &&
      ariaInvalid !== false &&
      ariaInvalid !== 'false');
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') ||
    undefined;
  const errorMessage =
    [ariaErrorMessage, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className="notable-switch-field"
      data-disabled={props.disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <label className="notable-switch" htmlFor={switchId}>
        <span className="notable-switch__control">
          <input
            {...props}
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            className={['notable-switch__input', className]
              .filter(Boolean)
              .join(' ')}
            aria-describedby={describedBy}
            aria-invalid={invalid || Boolean(error) ? true : ariaInvalid}
            aria-errormessage={errorMessage}
          />
          <span className="notable-switch__track" aria-hidden="true">
            <span className="notable-switch__thumb" />
          </span>
        </span>
        {label && <span className="notable-switch__label">{label}</span>}
      </label>
      {description && (
        <span className="notable-switch__description" id={descriptionId}>
          {description}
        </span>
      )}
      {error && (
        <span className="notable-switch__error" id={errorId} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
});
