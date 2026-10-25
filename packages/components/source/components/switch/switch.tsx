import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './switch.css';

/** Props for a checkbox exposed with switch semantics. */
export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  /** Helper text associated with the switch for assistive technologies. */
  description?: ReactNode;
  /** Error message associated with the switch and announced politely. */
  error?: ReactNode;
  /** Marks the switch as invalid even when no error is displayed. */
  invalid?: boolean;
  /** Visible label associated with the switch. */
  label?: ReactNode;
};

/**
 * Renders a native checkbox with `role="switch"` and optional label,
 * description, and error. Forwards its ref to the native input.
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
