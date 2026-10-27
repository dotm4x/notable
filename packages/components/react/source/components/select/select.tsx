import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import {
  Children,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import '../../internal/styles/floating-surface.css';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import './select.css';

/** Props for the select root. Options are declared as `Select.Item` children. */
export type SelectProps = {
  /** Selected option value. Pass `null` for no selection. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Field name used when the select is submitted with a form. */
  name?: string;
  children?: ReactNode;
};

/** Base UI props with `className` narrowed to a string, since Notable composes class names directly. */
type WithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type SelectLabelProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Label>
>;

export type SelectTriggerProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>;

export type SelectValueProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Value>
>;

export type SelectIconProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Icon>
>;

export type SelectContentProps = ComponentPropsWithoutRef<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
};

export type SelectListProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.List>
>;

export type SelectItemProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Item>
>;

export type SelectGroupProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Group>
>;

export type SelectGroupLabelProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>;

export type SelectSeparatorProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>;

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Maps each option value to its label by walking the declared `Select.Item`
 * children. Base UI needs this to show the selected label while the popup is
 * closed, such as for a `defaultValue`.
 */
function collectItemLabels(
  children: ReactNode,
  labels: Record<string, ReactNode> = {},
): Record<string, ReactNode> {
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: unknown; children?: ReactNode }>(child)) {
      return;
    }
    if (child.type === SelectItem && typeof child.props.value === 'string') {
      labels[child.props.value] = child.props.children;
      return;
    }
    collectItemLabels(child.props.children, labels);
  });
  return labels;
}

/**
 * Renders a single-selection select for choosing from a predefined set of
 * options. Use `Combobox` when the user needs to search or filter options.
 */
function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  readOnly,
  required,
  name,
  children,
}: SelectProps) {
  return (
    <BaseSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
      items={collectItemLabels(children)}
    >
      {children}
    </BaseSelect.Root>
  );
}

const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  function SelectLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.Label
        ref={ref}
        className={joinClassNames('notable-select__label', className)}
        {...props}
      />
    );
  },
);

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, ...props }, ref) {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={joinClassNames('notable-select__trigger', className)}
        {...props}
      />
    );
  },
);

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ className, ...props }, ref) {
    return (
      <BaseSelect.Value
        ref={ref}
        className={joinClassNames('notable-select__value', className)}
        {...props}
      />
    );
  },
);

const SelectIcon = forwardRef<HTMLSpanElement, SelectIconProps>(
  function SelectIcon({ className, children, ...props }, ref) {
    return (
      <BaseSelect.Icon
        ref={ref}
        className={joinClassNames('notable-select__icon', className)}
        {...props}
      >
        {children ?? <ChevronDown size={16} aria-hidden="true" />}
      </BaseSelect.Icon>
    );
  },
);

/**
 * Base UI handles Home but not End for select options, so End moves the
 * highlight to the last enabled option.
 */
function focusLastEnabledOptionOnEnd(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'End') {
    return;
  }

  const enabledOptions = event.currentTarget.querySelectorAll<HTMLElement>(
    '[role="option"]:not([aria-disabled="true"])',
  );
  const lastOption = enabledOptions.item(enabledOptions.length - 1);
  if (!lastOption) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  lastOption.focus();
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      className,
      children,
      onKeyDownCapture,
      ...props
    },
    ref,
  ) {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          alignItemWithTrigger={false}
          className="notable-select__positioner"
        >
          <BaseSelect.Popup
            ref={ref}
            className={joinClassNames(
              'notable-select__popup notable-floating-surface',
              className,
            )}
            onKeyDownCapture={(event) => {
              focusLastEnabledOptionOnEnd(event);
              onKeyDownCapture?.(event);
            }}
            {...props}
          >
            <AnimatedHighlight />
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
);

const SelectList = forwardRef<HTMLDivElement, SelectListProps>(
  function SelectList({ className, ...props }, ref) {
    return (
      <BaseSelect.List
        ref={ref}
        className={joinClassNames('notable-select__list', className)}
        {...props}
      />
    );
  },
);

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <BaseSelect.Item
        ref={ref}
        className={joinClassNames('notable-select__item', className)}
        {...props}
      >
        <BaseSelect.ItemText className="notable-select__item-text">
          {children}
        </BaseSelect.ItemText>
        <BaseSelect.ItemIndicator className="notable-select__item-indicator">
          <Check size={16} aria-hidden="true" />
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    );
  },
);

const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  function SelectGroup({ className, ...props }, ref) {
    return (
      <BaseSelect.Group
        ref={ref}
        className={joinClassNames('notable-select__group', className)}
        {...props}
      />
    );
  },
);

const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  function SelectGroupLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.GroupLabel
        ref={ref}
        className={joinClassNames('notable-select__group-label', className)}
        {...props}
      />
    );
  },
);

const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, ...props }, ref) {
    return (
      <BaseSelect.Separator
        ref={ref}
        className={joinClassNames('notable-select__separator', className)}
        {...props}
      />
    );
  },
);

/**
 * Single-selection select built on Base UI. Compose it with `Select.Trigger`,
 * `Select.Value`, `Select.Icon`, and `Select.Content`. Forwards refs to the
 * DOM element each part renders.
 */
export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Content: SelectContent,
  List: SelectList,
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
});
