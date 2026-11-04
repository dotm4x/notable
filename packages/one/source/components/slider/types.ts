import type { ComponentPropsWithoutRef, ReactNode } from 'react';

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
