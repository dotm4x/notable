import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './switch.css';

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
};

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
      className="bodypop-switch-field"
      data-disabled={props.disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <label className="bodypop-switch" htmlFor={switchId}>
        <span className="bodypop-switch__control">
          <input
            {...props}
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            className={['bodypop-switch__input', className]
              .filter(Boolean)
              .join(' ')}
            aria-describedby={describedBy}
            aria-invalid={invalid || Boolean(error) ? true : ariaInvalid}
            aria-errormessage={errorMessage}
          />
          <span className="bodypop-switch__track" aria-hidden="true">
            <span className="bodypop-switch__thumb" />
          </span>
        </span>
        {label && <span className="bodypop-switch__label">{label}</span>}
      </label>
      {description && (
        <span className="bodypop-switch__description" id={descriptionId}>
          {description}
        </span>
      )}
      {error && (
        <span className="bodypop-switch__error" id={errorId} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
});
