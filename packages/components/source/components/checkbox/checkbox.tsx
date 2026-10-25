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

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  description?: ReactNode;
  indeterminate?: boolean;
  label?: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      description,
      id,
      indeterminate = false,
      label,
      'aria-describedby': ariaDescribedBy,
      'aria-checked': ariaChecked,
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
    const checkedState = indeterminate ? 'mixed' : ariaChecked;
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
        className="bodypop-checkbox-field"
        data-disabled={props.disabled || undefined}
      >
        <label className="bodypop-checkbox" htmlFor={checkboxId}>
          <span className="bodypop-checkbox__control">
            <input
              {...props}
              ref={setInputRef}
              id={checkboxId}
              type="checkbox"
              aria-checked={checkedState}
              className={['bodypop-checkbox__input', className]
                .filter(Boolean)
                .join(' ')}
              aria-describedby={describedBy}
            />
            <span className="bodypop-checkbox__indicator" aria-hidden="true">
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
          {label && <span className="bodypop-checkbox__label">{label}</span>}
        </label>
        {description && (
          <span className="bodypop-checkbox__description" id={descriptionId}>
            {description}
          </span>
        )}
      </div>
    );
  },
);
