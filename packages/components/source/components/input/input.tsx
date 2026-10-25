import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './input.css';

/** Propiedades del campo de entrada con etiqueta, descripción, error y adornos opcionales. */
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Texto de ayuda asociado al campo para tecnologías de asistencia. */
  description?: ReactNode;
  /** Mensaje de error asociado al campo que también lo marca como no válido. */
  error?: ReactNode;
  /** Marca el campo como no válido aunque no se muestre un error. */
  invalid?: boolean;
  /** Etiqueta visible asociada al campo nativo. */
  label?: ReactNode;
  /** Contenido decorativo o interactivo antes del valor. */
  leadingIcon?: ReactNode;
  /** Evita ocultar el adorno inicial a las tecnologías de asistencia. */
  leadingIconInteractive?: boolean;
  /** Contenido decorativo o interactivo después del valor. */
  trailingIcon?: ReactNode;
  /** Evita ocultar el adorno final a las tecnologías de asistencia. */
  trailingIconInteractive?: boolean;
};

/**
 * Renderiza un campo nativo con etiqueta, descripción, error y contenido
 * inicial o final opcionales. Reenvía la referencia al campo nativo.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    description,
    error,
    id,
    invalid = false,
    label,
    leadingIcon,
    leadingIconInteractive = false,
    trailingIcon,
    trailingIconInteractive = false,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const hasAriaInvalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== 'false';
  const isInvalid = invalid || Boolean(error) || hasAriaInvalid;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') ||
    undefined;
  const errorMessage =
    [ariaErrorMessage, errorId].filter(Boolean).join(' ') || undefined;
  const invalidAttribute = invalid || Boolean(error) ? true : ariaInvalid;

  return (
    <div
      className="notable-input-field"
      data-disabled={props.disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={props.readOnly || undefined}
    >
      {label && (
        <label className="notable-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <span className="notable-input__control">
        {leadingIcon && (
          <span
            className="notable-input__icon"
            aria-hidden={leadingIconInteractive ? undefined : true}
          >
            {leadingIcon}
          </span>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={['notable-input', className].filter(Boolean).join(' ')}
          aria-describedby={describedBy}
          aria-invalid={invalidAttribute}
          aria-errormessage={errorMessage}
        />
        {trailingIcon && (
          <span
            className="notable-input__icon"
            aria-hidden={trailingIconInteractive ? undefined : true}
          >
            {trailingIcon}
          </span>
        )}
      </span>
      {description && (
        <span className="notable-input__description" id={descriptionId}>
          {description}
        </span>
      )}
      {error && (
        <span className="notable-input__error" id={errorId} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
});
