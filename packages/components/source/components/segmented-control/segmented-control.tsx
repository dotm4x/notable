import {
  forwardRef,
  useId,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import './segmented-control.css';

/** Tamaños disponibles para el control segmentado. */
export type SegmentedControlSize = 'small' | 'medium' | 'large';

/** Opción seleccionable de un {@link SegmentedControl}. */
export type SegmentedControlOption<TValue extends string = string> = {
  /** Contenido de la etiqueta visible. */
  label: ReactNode;
  /** Valor único de la opción. */
  value: TValue;
  /** Indica si esta opción está desactivada. */
  disabled?: boolean;
  /** Icono opcional que se muestra junto a la etiqueta. */
  icon?: ReactNode;
  /** Nombre accesible explícito opcional para la opción. */
  'aria-label'?: string;
};

/** Propiedades de un grupo de opciones de selección única. */
export type SegmentedControlProps<TValue extends string = string> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> & {
  /** Opciones que se muestran en el grupo. */
  options: readonly SegmentedControlOption<TValue>[];
  /** Valor seleccionado en el modo controlado. */
  value?: TValue;
  /** Valor inicial en el modo no controlado. */
  defaultValue?: TValue;
  /** Se invoca con el valor seleccionado cuando cambia la selección. */
  onChange?: (value: TValue) => void;
  /** Desactiva todas las opciones. */
  disabled?: boolean;
  /** Tamaño visual. Por defecto, `medium`. */
  size?: SegmentedControlSize;
  /** Nombre compartido por los botones de opción nativos al enviar el formulario. */
  name?: string;
  /** Etiqueta visible opcional que se muestra sobre el grupo. */
  label?: ReactNode;
};

type SegmentedControlComponent = <TValue extends string = string>(
  props: SegmentedControlProps<TValue> & { ref?: Ref<HTMLDivElement> },
) => ReactNode;

/**
 * Renderiza un grupo de opciones excluyentes en modo controlado o no controlado.
 * No permite seleccionar opciones desactivadas y notifica cambios mediante `onChange`.
 */
export const SegmentedControl: SegmentedControlComponent = forwardRef(
  function SegmentedControl<TValue extends string = string>(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className,
      defaultValue,
      disabled = false,
      id,
      label,
      name,
      onChange,
      options,
      size = 'medium',
      value,
      ...props
    }: SegmentedControlProps<TValue>,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const groupName = name ?? `bodypop-segmented-control-${controlId}`;
    const labelId = label ? `${controlId}-label` : undefined;
    const resolvedAriaLabelledBy = ariaLabelledBy ?? labelId;
    const shouldReduceMotion = useReducedMotion();

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      TValue | undefined
    >(defaultValue);
    const selectedValue = isControlled ? value : uncontrolledValue;

    const handleSelect = (optionValue: TValue) => {
      if (disabled) {
        return;
      }

      const targetOption = options.find((opt) => opt.value === optionValue);
      if (targetOption?.disabled) {
        return;
      }

      if (optionValue === selectedValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }

      onChange?.(optionValue);
    };

    const classes = [
      'notable-segmented-control',
      `notable-segmented-control--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const controlContent = (
      <div
        {...props}
        ref={ref}
        id={controlId}
        role="radiogroup"
        className={classes}
        aria-label={ariaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
      >
        <LayoutGroup id={controlId}>
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isOptionDisabled = disabled || Boolean(option.disabled);
            const optionId = `${controlId}-option-${index}`;

            return (
              <label
                key={`${option.value}-${index}`}
                htmlFor={optionId}
                className="notable-segmented-control__item"
                data-selected={isSelected || undefined}
                data-disabled={isOptionDisabled || undefined}
              >
                <input
                  id={optionId}
                  type="radio"
                  className="notable-segmented-control__input"
                  name={groupName}
                  value={option.value}
                  checked={isSelected}
                  disabled={isOptionDisabled}
                  aria-label={option['aria-label']}
                  onChange={() => handleSelect(option.value)}
                />
                {isSelected && (
                  <motion.span
                    layoutId={`notable-segmented-control-indicator-${controlId}`}
                    className="notable-segmented-control__indicator"
                    data-disabled={isOptionDisabled || undefined}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 450,
                            damping: 35,
                          }
                    }
                    aria-hidden="true"
                  />
                )}
                <span className="notable-segmented-control__content">
                  {option.icon && (
                    <span
                      className="notable-segmented-control__icon"
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                  )}
                  <span className="notable-segmented-control__label">
                    {option.label}
                  </span>
                </span>
              </label>
            );
          })}
        </LayoutGroup>
      </div>
    );

    if (label) {
      return (
        <div
          className="notable-segmented-control-field"
          data-disabled={disabled || undefined}
        >
          <span id={labelId} className="notable-segmented-control__group-label">
            {label}
          </span>
          {controlContent}
        </div>
      );
    }

    return controlContent;
  },
) as unknown as SegmentedControlComponent;
