import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type CSSProperties,
} from 'react';
import {
  getMarkPercentage,
  getSliderMarks,
  hasMarkLabel,
  isMarkActive,
} from './helpers/marks.js';
import { joinClassNames } from '../../internal/helpers/join-class-names.js';
import type { TSliderProps, TSliderValue } from './types.js';
import './slider.css';

export type { TSliderMark, TSliderProps, TSliderValue } from './types.js';

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
          'one-slider',
          'one-slider--fixed',
          `one-slider--${orientation}`,
          className,
        )}
        data-disabled
        data-orientation={orientation}
        data-invalid={isInvalid || undefined}
        data-readonly={readOnly || undefined}
      >
        {(hasLabel || showValue) && (
          <div className="one-slider__header">
            {hasLabel && (
              <span className="one-slider__label" id={labelId}>
                {label}
              </span>
            )}
            {showValue && (
              <output className="one-slider__value">
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
          <span className="one-slider__description" id={descriptionId}>
            {description}
          </span>
        )}
        {hasError && (
          <span className="one-slider__error" id={errorId}>
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
        <div className="one-slider__control" data-orientation={orientation}>
          <div className="one-slider__track">
            {resolvedMarks.map((mark) => (
              <span
                key={mark.value}
                className="one-slider__mark"
                data-active={mark.value === min || undefined}
                aria-hidden={hasMarkLabel(mark.label) ? undefined : true}
                style={
                  {
                    '--_slider-mark-position': `${getMarkPercentage(mark.value, min, max)}%`,
                  } as CSSProperties
                }
              >
                {hasMarkLabel(mark.label) && (
                  <span className="one-slider__mark-label">{mark.label}</span>
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
                className="one-slider__thumb"
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
        'one-slider',
        `one-slider--${orientation}`,
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
        <div className="one-slider__header">
          {hasLabel && (
            <BaseSlider.Label className="one-slider__label">
              {label}
            </BaseSlider.Label>
          )}
          {showValue && (
            <BaseSlider.Value className="one-slider__value">
              {formatValue
                ? (_formattedValues, values) =>
                    values.map(formatValue).join(' – ')
                : undefined}
            </BaseSlider.Value>
          )}
        </div>
      )}
      {hasDescription && (
        <span className="one-slider__description" id={descriptionId}>
          {description}
        </span>
      )}
      {hasError && (
        <span className="one-slider__error" id={errorId}>
          {error}
        </span>
      )}
      <BaseSlider.Control className="one-slider__control">
        <BaseSlider.Track className="one-slider__track">
          <BaseSlider.Indicator className="one-slider__indicator" />
          {resolvedMarks.map((mark) => (
            <span
              key={mark.value}
              className="one-slider__mark"
              data-active={
                isMarkActive(mark.value, currentValues, isRange, min) ||
                undefined
              }
              aria-hidden={hasMarkLabel(mark.label) ? undefined : true}
              style={
                {
                  '--_slider-mark-position': `${getMarkPercentage(mark.value, min, max)}%`,
                } as CSSProperties
              }
            >
              {hasMarkLabel(mark.label) && (
                <span className="one-slider__mark-label">{mark.label}</span>
              )}
            </span>
          ))}
          {currentValues.map((_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={isRange ? index : undefined}
              className="one-slider__thumb"
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
