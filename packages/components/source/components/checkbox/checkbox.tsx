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

/** Propiedades de una casilla nativa con etiqueta y descripción opcionales. */
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  /** Texto de ayuda asociado a la casilla para tecnologías de asistencia. */
  description?: ReactNode;
  /** Activa el estado indeterminado nativo. Por defecto, `false`. */
  indeterminate?: boolean;
  /** Etiqueta visible asociada a la casilla. */
  label?: ReactNode;
};

/**
 * Renderiza una casilla nativa con etiqueta y descripción opcionales.
 * Reenvía la referencia al campo nativo.
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
              aria-checked={checkedState}
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
