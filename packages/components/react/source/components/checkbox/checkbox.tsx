import {
  useCallback,
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './checkbox.css';

/**
 * Props for a native checkbox with an optional label and description. Use
 * `indeterminate` for the mixed state; `aria-checked` is not supported on a
 * native checkbox because the browser already exposes the checked and mixed
 * states.
 */
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'aria-checked'
> & {
  /** Helper text associated with the checkbox for assistive technologies. */
  description?: ReactNode;
  /** Enables the native indeterminate state. Defaults to `false`. */
  indeterminate?: boolean;
  /** Visible label associated with the checkbox. */
  label?: ReactNode;
};

/**
 * Renders a native checkbox with an optional label and description.
 * Forwards its ref to the native input.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      description,
      id,
      indeterminate = false,
      label,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;
    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div
        className="notable-checkbox-field"
        data-disabled={props.disabled || undefined}
      >
        <label className="notable-checkbox" htmlFor={checkboxId}>
          <span className="notable-checkbox__control">
            <input
              {...props}
              ref={setInputRef}
              id={checkboxId}
              type="checkbox"
              className={['notable-checkbox__input', className]
                .filter(Boolean)
                .join(' ')}
              aria-describedby={describedBy}
            />
            <span className="notable-checkbox__indicator" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="m3.5 8.5 3 3 6-7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M3.5 8h9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </span>
          {label && <span className="notable-checkbox__label">{label}</span>}
        </label>
        {description && (
          <span className="notable-checkbox__description" id={descriptionId}>
            {description}
          </span>
        )}
      </div>
    );
  },
);
