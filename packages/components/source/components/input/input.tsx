import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './input.css';

/** Props for an input with an optional label, description, error, and adornments. */
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Helper text associated with the input for assistive technologies. */
  description?: ReactNode;
  /** Error message associated with the input; also marks it as invalid. */
  error?: ReactNode;
  /** Marks the input as invalid even when no error is displayed. */
  invalid?: boolean;
  /** Visible label associated with the native input. */
  label?: ReactNode;
  /** Decorative or interactive content displayed before the value. */
  leadingIcon?: ReactNode;
  /** Prevents assistive technologies from hiding the leading adornment. */
  leadingIconInteractive?: boolean;
  /** Decorative or interactive content displayed after the value. */
  trailingIcon?: ReactNode;
  /** Prevents assistive technologies from hiding the trailing adornment. */
  trailingIconInteractive?: boolean;
};

/**
 * Renders a native input with optional label, description, error, and leading
 * or trailing content. Forwards its ref to the native input.
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
