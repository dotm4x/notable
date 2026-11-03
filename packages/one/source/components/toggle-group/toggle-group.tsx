import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';
import {
  Toggle,
  type TToggleSize,
  type TToggleVariant,
} from '../toggle/toggle.js';
import './toggle-group.css';

/** Selection mode for a toggle group. */
export type TToggleGroupType = 'single' | 'multiple';

/** Direction in which the toggle items are laid out. */
export type TToggleGroupOrientation = 'horizontal' | 'vertical';

type TToggleGroupBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  /** Disables every item in the group. Defaults to `false`. */
  disabled?: boolean;
  /** Layout direction. Defaults to `horizontal`. */
  orientation?: TToggleGroupOrientation;
  /** Visual appearance inherited by each item. Defaults to `default`. */
  variant?: TToggleVariant;
  /** Visual size inherited by each item. Defaults to `medium`. */
  size?: TToggleSize;
};

/** Props for a single-selection toggle group. */
export type TToggleGroupSingleProps = TToggleGroupBaseProps & {
  /** Enables exclusive single selection. */
  type: 'single';
  /** Selected non-empty item value, or `null` for no selection. */
  value?: string | null;
  /** Initial non-empty item value in uncontrolled mode. */
  defaultValue?: string;
  /** Called with the selected value, or `null` when the selection is cleared. */
  onValueChange?: (value: string | null) => void;
};

/** Props for a multiple-selection toggle group. */
export type TToggleGroupMultipleProps = TToggleGroupBaseProps & {
  /** Enables independent multiple selection. */
  type: 'multiple';
  /** Selected non-empty item values in controlled mode. */
  value?: readonly string[];
  /** Initial non-empty item values in uncontrolled mode. */
  defaultValue?: readonly string[];
  /** Called with the complete list of selected values after a change. */
  onValueChange?: (value: string[]) => void;
};

/** Props for a single- or multiple-selection toggle group. */
export type TToggleGroupProps =
  TToggleGroupSingleProps | TToggleGroupMultipleProps;

/** Props for an individual toggle button within a `ToggleGroup`. */
export type TToggleGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'value'
> & {
  /** Non-empty value represented by this item. */
  value: string;
};

type TToggleGroupStyleContextValue = {
  variant: TToggleVariant;
  size: TToggleSize;
};

const ToggleGroupStyleContext =
  createContext<TToggleGroupStyleContextValue | null>(null);

function hasEmptyValue(value: string | null | readonly string[] | undefined) {
  return value === '' || (Array.isArray(value) && value.includes(''));
}

const ToggleGroupRoot = forwardRef<HTMLDivElement, TToggleGroupProps>(
  function ToggleGroupRoot(
    {
      children,
      className,
      disabled = false,
      orientation = 'horizontal',
      size = 'medium',
      variant = 'default',
      type,
      value: selectedValue,
      defaultValue: initialValue,
      onValueChange: onSelectionChange,
      ...baseProps
    },
    ref,
  ) {
    if (hasEmptyValue(selectedValue) || hasEmptyValue(initialValue)) {
      throw new Error('ToggleGroup values must be non-empty strings.');
    }

    const isControlled = selectedValue !== undefined;
    let value: readonly string[] | undefined;
    let defaultValue: readonly string[] | undefined;
    let onValueChange: ((value: string[]) => void) | undefined;

    if (type === 'single') {
      value =
        selectedValue === undefined
          ? undefined
          : selectedValue === null
            ? []
            : [selectedValue];
      defaultValue = initialValue === undefined ? undefined : [initialValue];
      onValueChange = (nextValue) => {
        onSelectionChange?.(nextValue[0] ?? null);
      };
    } else {
      value = selectedValue;
      defaultValue = initialValue;
      onValueChange = (nextValue) => onSelectionChange?.(nextValue);
    }

    return (
      <ToggleGroupStyleContext.Provider value={{ variant, size }}>
        <BaseToggleGroup
          {...baseProps}
          ref={ref}
          className={['one-toggle-group', className].filter(Boolean).join(' ')}
          disabled={disabled}
          orientation={orientation}
          multiple={type === 'multiple'}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onValueChange={onValueChange}
        >
          {children}
        </BaseToggleGroup>
      </ToggleGroupStyleContext.Provider>
    );
  },
);

const ToggleGroupItem = forwardRef<HTMLButtonElement, TToggleGroupItemProps>(
  function ToggleGroupItem({ className, value, ...props }, ref) {
    const styles = useContext(ToggleGroupStyleContext);

    if (!styles) {
      throw new Error(
        'ToggleGroup.Item must be rendered inside a ToggleGroup.',
      );
    }

    if (!value) {
      throw new Error('ToggleGroup values must be non-empty strings.');
    }

    return (
      <Toggle
        {...props}
        ref={ref}
        value={value}
        variant={styles.variant}
        size={styles.size}
        className={['one-toggle-group__item', className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  },
);

export interface TToggleGroupComponent extends ForwardRefExoticComponent<
  TToggleGroupProps & RefAttributes<HTMLDivElement>
> {
  /** Renders an individual toggle button within the group. */
  Item: typeof ToggleGroupItem;
}

/** Compound toggle group: `ToggleGroup` is the root and `ToggleGroup.Item` its options. */
export const ToggleGroup: TToggleGroupComponent = Object.assign(
  ToggleGroupRoot,
  {
    Item: ToggleGroupItem,
  },
);
