import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './slider.css';

/** A numeric value or multiple values for a multi-thumb slider. */
export type TSliderValue = number | readonly number[];

/** A decorative tick on the slider track. Marks do not change step behavior. */
export type TSliderMark = number | { value: number; label?: ReactNode };

/** Props for a single-value or range slider. */
export type TSliderProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'aria-orientation'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'children'
  | 'defaultValue'
  | 'onChange'
> & {
  /** Helper text associated with the slider for assistive technologies. */
  description?: ReactNode;
  /** Value selected initially when the slider is uncontrolled. */
  defaultValue?: TSliderValue;
  /** Disables interaction with the slider. Defaults to `false`. */
  disabled?: boolean;
  /** Message associated with an invalid slider. */
  error?: ReactNode;
  /** Options used to format numeric values with `Intl.NumberFormat`. */
  format?: Intl.NumberFormatOptions;
  /** Form identifier when the slider is submitted. */
  form?: string;
  /** Returns a display and accessible value string for each numeric value. */
  formatValue?: (value: number) => string;
  /** Visible label associated with the slider. */
  label?: ReactNode;
  /** Maximum allowed value. Defaults to `100`. */
  max?: number;
  /** Minimum allowed value. Defaults to `0`. */
  min?: number;
  /** Minimum distance between range thumbs, in steps. Defaults to `0`. */
  minStepsBetweenValues?: number;
  /** Visible marks. A numeric mark is displayed without a label. */
  marks?: readonly TSliderMark[];
  /** Adds marks at this interval, including the minimum and maximum. */
  markInterval?: number;
  /** Form name used when the slider is submitted. */
  name?: string;
  /** Called with the new numeric value or range when the slider changes. */
  onValueChange?: (value: TSliderValue) => void;
  /** Called when the value is committed after an interaction. */
  onValueCommitted?: (value: TSliderValue) => void;
  /** Horizontal by default; vertical sliders are supported. */
  orientation?: 'horizontal' | 'vertical';
  /** Disables interaction without removing the current value from forms. */
  readOnly?: boolean;
  /** Marks the slider as required for assistive technology. */
  required?: boolean;
  /** Distance between selectable values. Defaults to `1`. */
  step?: number;
  /** Displays the current value beside the label. Defaults to `false`. */
  showValue?: boolean;
  /** Thumb labels, in value order, for range sliders. */
  thumbLabels?: readonly string[];
  /** How thumbs align at the endpoints. Defaults to `center`. */
  thumbAlignment?: 'center' | 'edge' | 'edge-client-only';
  /** How range thumbs behave when they collide. Defaults to `push`. */
  thumbCollisionBehavior?: 'push' | 'swap' | 'none';
  /** Locale passed to `Intl.NumberFormat`. */
  locale?: Intl.LocalesArgument;
  /** Larger keyboard increment. Defaults to `10`. */
  largeStep?: number;
  /** Marks the slider as invalid even when no error is displayed. */
  invalid?: boolean;
  /** Current value when the slider is controlled. */
  value?: TSliderValue;
};

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

function hasMarkLabel(label: ReactNode): boolean {
  return label !== undefined && label !== null && typeof label !== 'boolean';
}

function getSliderMarks(
  marks: readonly TSliderMark[],
  markInterval: number | undefined,
  min: number,
  max: number,
): { value: number; label?: ReactNode }[] {
  const resolvedMarks = new Map<number, { value: number; label?: ReactNode }>();

  marks.forEach((mark) => {
    const value = typeof mark === 'number' ? mark : mark.value;

    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(
        'Slider marks must be finite values within min and max.',
      );
    }

    resolvedMarks.set(value, {
      value,
      ...(typeof mark === 'number' ? {} : { label: mark.label }),
    });
  });

  if (markInterval !== undefined) {
    if (!Number.isFinite(markInterval) || markInterval <= 0) {
      throw new RangeError(
        'Slider markInterval must be a finite positive number.',
      );
    }

    const markCount = Math.floor((max - min) / markInterval);

    // shortcut: interval-generated marks are capped at 501, raise only if dense tracks are required.
    if (markCount > 500) {
      throw new RangeError(
        'Slider markInterval cannot create more than 501 marks.',
      );
    }

    for (let index = 0; index <= markCount; index += 1) {
      const value = Number((min + index * markInterval).toPrecision(12));
      resolvedMarks.set(value, resolvedMarks.get(value) ?? { value });
    }
    resolvedMarks.set(max, resolvedMarks.get(max) ?? { value: max });
  }

  return [...resolvedMarks.values()].sort(
    (first, second) => first.value - second.value,
  );
}

/**
 * Renders an accessible, single-value or range slider. Base UI manages value
 * state, thumb interaction, collision handling, keyboard behavior, and forms.
 */
export const Slider = forwardRef<HTMLDivElement, TSliderProps>(function Slider(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-valuetext': ariaValueText,
    className,
    defaultValue,
    description,
    disabled = false,
    error,
    format,
    formatValue,
    form,
    id,
    invalid = false,
    label,
    largeStep,
    locale,
    max = 100,
    min = 0,
    minStepsBetweenValues,
    marks = [],
    markInterval,
    name,
    onValueChange,
    onValueCommitted,
    orientation = 'horizontal',
    readOnly = false,
    required = false,
    showValue = false,
    step = 1,
    thumbAlignment = 'center',
    thumbCollisionBehavior = 'push',
    thumbLabels,
    value,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const hasDescription =
    description !== undefined && description !== null && description !== false;
  const descriptionId = hasDescription ? `${sliderId}-description` : undefined;
  const hasError = error !== undefined && error !== null && error !== false;
  const errorId = hasError ? `${sliderId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') ||
    undefined;
  const isInvalid = invalid || hasError;
  const isFixed = min === max;
  const hasLabel = label !== undefined && label !== null && label !== false;
  const isRange = Array.isArray(value) || Array.isArray(defaultValue);

  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    throw new RangeError('Slider min and max must be finite, with max >= min.');
  }

  if (!Number.isFinite(step) || step <= 0) {
    throw new RangeError('Slider step must be a finite positive number.');
  }

  const resolvedMarks = getSliderMarks(marks, markInterval, min, max);
  const [uncontrolledValue, setUncontrolledValue] = useState<TSliderValue>(
    () => defaultValue ?? (isRange ? [min, max] : min),
  );
  const currentValue = value ?? uncontrolledValue;
  const currentValues = Array.isArray(currentValue)
    ? currentValue
    : [currentValue];
  const numberFormat = new Intl.NumberFormat(locale, format);
  const labelId = hasLabel ? `${sliderId}-label` : undefined;

  if (Array.isArray(currentValue) && currentValue.length < 2) {
    throw new RangeError(
      'Slider range values must contain at least two values.',
    );
  }
  const setInputAccessibility = useCallback(
    (input: HTMLInputElement | null) => {
      if (!input) {
        return;
      }

      // Base UI does not forward these state attributes from Thumb to its nested range input.
      const attributes = {
        'aria-readonly': readOnly,
        'aria-invalid': isInvalid,
        'aria-required': required,
      };

      Object.entries(attributes).forEach(([attribute, enabled]) => {
        if (enabled) {
          input.setAttribute(attribute, 'true');
        } else {
          input.removeAttribute(attribute);
        }
      });
    },
    [isInvalid, readOnly, required],
  );

  if (isFixed) {
    const fixedValues = (
      isRange ? currentValues : [currentValues[0] ?? min]
    ).map((currentValue) => Math.min(Math.max(currentValue, min), max));

    return (
      <div
        {...props}
        ref={ref}
        id={sliderId}
        className={joinClassNames(
          'notable-slider',
          'notable-slider--fixed',
          `notable-slider--${orientation}`,
          className,
        )}
        data-disabled
        data-orientation={orientation}
        data-invalid={isInvalid || undefined}
        data-readonly={readOnly || undefined}
      >
        {(hasLabel || showValue) && (
          <div className="notable-slider__header">
            {hasLabel && (
              <span className="notable-slider__label" id={labelId}>
                {label}
              </span>
            )}
            {showValue && (
              <output className="notable-slider__value">
                {fixedValues
                  .map(
                    (fixedValue) =>
                      formatValue?.(fixedValue) ??
                      numberFormat.format(fixedValue),
                  )
                  .join(' – ')}
              </output>
            )}
          </div>
        )}
        {hasDescription && (
          <span className="notable-slider__description" id={descriptionId}>
            {description}
          </span>
        )}
        {hasError && (
          <span className="notable-slider__error" id={errorId}>
            {error}
          </span>
        )}
        {name &&
          fixedValues.map((fixedValue, index) => (
            <input
              key={index}
              type="hidden"
              name={name}
              value={fixedValue}
              form={form}
              disabled={disabled}
            />
          ))}
        <div className="notable-slider__control" data-orientation={orientation}>
          <div className="notable-slider__track">
            {resolvedMarks.map((mark) => (
              <span
                key={mark.value}
                className="notable-slider__mark"
                data-active={mark.value === min || undefined}
                aria-hidden={hasMarkLabel(mark.label) ? undefined : true}
                style={
                  {
                    '--notable-slider-mark-position': `${max === min ? 50 : ((mark.value - min) / (max - min)) * 100}%`,
                  } as CSSProperties
                }
              >
                {hasMarkLabel(mark.label) && (
                  <span className="notable-slider__mark-label">
                    {mark.label}
                  </span>
                )}
              </span>
            ))}
            {fixedValues.map((fixedValue, index) => (
              <span
                key={index}
                role="slider"
                aria-label={thumbLabels?.[index] ?? ariaLabel}
                aria-labelledby={ariaLabelledBy ?? labelId}
                aria-describedby={describedBy}
                aria-invalid={isInvalid || undefined}
                aria-readonly={readOnly || undefined}
                aria-valuetext={
                  ariaValueText ??
                  formatValue?.(fixedValue) ??
                  numberFormat.format(fixedValue)
                }
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={fixedValue}
                aria-disabled="true"
                aria-orientation={orientation}
                aria-required={required || undefined}
                tabIndex={-1}
                className="notable-slider__thumb"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseSlider.Root<TSliderValue>
      {...props}
      ref={ref}
      id={sliderId}
      className={joinClassNames(
        'notable-slider',
        `notable-slider--${orientation}`,
        className,
      )}
      data-invalid={isInvalid || undefined}
      data-readonly={readOnly || undefined}
      aria-invalid={isInvalid || undefined}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      minStepsBetweenValues={minStepsBetweenValues}
      thumbAlignment={thumbAlignment}
      thumbCollisionBehavior={thumbCollisionBehavior}
      orientation={orientation}
      format={format}
      locale={locale}
      disabled={disabled}
      form={form}
      name={name}
      onValueChange={(nextValue, eventDetails) => {
        if (readOnly) {
          eventDetails.cancel();
          return;
        }

        if (value === undefined) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      }}
      onValueCommitted={(nextValue) => {
        onValueCommitted?.(nextValue);
      }}
    >
      {(hasLabel || showValue) && (
        <div className="notable-slider__header">
          {hasLabel && (
            <BaseSlider.Label className="notable-slider__label">
              {label}
            </BaseSlider.Label>
          )}
          {showValue && (
            <BaseSlider.Value className="notable-slider__value">
              {formatValue
                ? (_formattedValues, values) =>
                    values.map(formatValue).join(' – ')
                : undefined}
            </BaseSlider.Value>
          )}
        </div>
      )}
      {hasDescription && (
        <span className="notable-slider__description" id={descriptionId}>
          {description}
        </span>
      )}
      {hasError && (
        <span className="notable-slider__error" id={errorId}>
          {error}
        </span>
      )}
      <BaseSlider.Control className="notable-slider__control">
        <BaseSlider.Track className="notable-slider__track">
          <BaseSlider.Indicator className="notable-slider__indicator" />
          {resolvedMarks.map((mark) => {
            const isActive = isRange
              ? mark.value >= Math.min(...currentValues) &&
                mark.value <= Math.max(...currentValues)
              : mark.value <= (currentValues[0] ?? min);

            return (
              <span
                key={mark.value}
                className="notable-slider__mark"
                data-active={isActive || undefined}
                aria-hidden={hasMarkLabel(mark.label) ? undefined : true}
                style={
                  {
                    '--notable-slider-mark-position': `${((mark.value - min) / (max - min)) * 100}%`,
                  } as CSSProperties
                }
              >
                {hasMarkLabel(mark.label) && (
                  <span className="notable-slider__mark-label">
                    {mark.label}
                  </span>
                )}
              </span>
            );
          })}
          {currentValues.map((_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={isRange ? index : undefined}
              className="notable-slider__thumb"
              aria-label={thumbLabels?.[index] ?? ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={describedBy}
              aria-invalid={isInvalid || undefined}
              aria-required={required || undefined}
              aria-valuetext={ariaValueText}
              inputRef={setInputAccessibility}
              getAriaValueText={
                formatValue
                  ? (_formattedValue, thumbValue) => formatValue(thumbValue)
                  : undefined
              }
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
});
