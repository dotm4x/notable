import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './input.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  leadingIcon?: ReactNode;
  leadingIconInteractive?: boolean;
  trailingIcon?: ReactNode;
  trailingIconInteractive?: boolean;
};

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
      className="bodypop-input-field"
      data-disabled={props.disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={props.readOnly || undefined}
    >
      {label && (
        <label className="bodypop-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <span className="bodypop-input__control">
        {leadingIcon && (
          <span
            className="bodypop-input__icon"
            aria-hidden={leadingIconInteractive ? undefined : true}
          >
            {leadingIcon}
          </span>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={['bodypop-input', className].filter(Boolean).join(' ')}
          aria-describedby={describedBy}
          aria-invalid={invalidAttribute}
          aria-errormessage={errorMessage}
        />
        {trailingIcon && (
          <span
            className="bodypop-input__icon"
            aria-hidden={trailingIconInteractive ? undefined : true}
          >
            {trailingIcon}
          </span>
        )}
      </span>
      {description && (
        <span className="bodypop-input__description" id={descriptionId}>
          {description}
        </span>
      )}
      {error && (
        <span className="bodypop-input__error" id={errorId} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
});
