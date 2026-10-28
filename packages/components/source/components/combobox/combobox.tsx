import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { ChevronDown, X } from 'lucide-react';
import {
  Fragment,
  forwardRef,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Input, type InputProps } from '../input/input.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import '../../internal/styles/floating-surface.css';
import './combobox.css';

/** A selectable option. `value` identifies it; `label` is shown and matched against the query. */
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/** A labeled set of options rendered under a group heading. */
export type ComboboxOptionGroup = {
  label: string;
  items: readonly ComboboxOption[];
};

/** Props for the combobox root. `items` is either a flat list of options or a list of groups. */
export type ComboboxProps = {
  items: readonly ComboboxOption[] | readonly ComboboxOptionGroup[];
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
  name?: string;
  children?: ReactNode;
};

export type ComboboxInputProps = Omit<
  InputProps,
  'children' | 'trailingIcon'
> & {
  /** Trailing controls, such as `Combobox.Clear` and `Combobox.Trigger`. */
  children?: ReactNode;
};

/** Base UI props with `className` narrowed to a string, since Notable composes class names directly. */
type WithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type ComboboxTriggerProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Trigger>
>;

export type ComboboxClearProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Clear>
>;

export type ComboboxContentProps = ComponentPropsWithoutRef<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
};

export type ComboboxListProps = Omit<
  WithStringClassName<ComponentPropsWithoutRef<typeof BaseCombobox.List>>,
  'children'
> & {
  /** Renders each option. Defaults to a plain item per option. */
  children?: (option: ComboboxOption, index: number) => ReactNode;
};

export type ComboboxItemProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Item>
>;

export type ComboboxEmptyProps = ComponentPropsWithoutRef<'div'>;

export type ComboboxGroupProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>;

export type ComboboxGroupLabelProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
>;

export type ComboboxSeparatorProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseCombobox.Separator>
>;

function isOptionGroup(
  entry: ComboboxOption | ComboboxOptionGroup,
): entry is ComboboxOptionGroup {
  return 'items' in entry;
}

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Renders a searchable single-select combobox. Options come from `items` so that
 * filtering and selected labels work with Base UI.
 */
function ComboboxRoot({
  items,
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
}: ComboboxProps) {
  const collection = useMemo(
    () =>
      BaseCombobox.createItems<ComboboxOption, string>(items, {
        getValue: (option) => option.value,
        getLabel: (option) => option.label,
      }),
    [items],
  );

  return (
    <BaseCombobox.Root
      items={collection}
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
    >
      {children}
    </BaseCombobox.Root>
  );
}

const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(
    {
      children,
      className,
      description,
      error,
      invalid,
      label,
      leadingIcon,
      ...props
    },
    ref,
  ) {
    return (
      <BaseCombobox.Input
        ref={ref}
        className={className}
        render={
          <Input
            description={description}
            error={error}
            invalid={invalid}
            label={label}
            leadingIcon={leadingIcon}
            trailingIcon={children}
            trailingIconInteractive
          />
        }
        {...props}
      />
    );
  },
);

const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  function ComboboxTrigger({ children, className, ...props }, ref) {
    return (
      <BaseCombobox.Trigger
        ref={ref}
        className={joinClassNames('notable-combobox__trigger', className)}
        aria-label={props['aria-label'] ?? 'Show options'}
        {...props}
      >
        {children ?? <ChevronDown size={16} aria-hidden="true" />}
      </BaseCombobox.Trigger>
    );
  },
);

const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(
  function ComboboxClear({ children, className, ...props }, ref) {
    return (
      <BaseCombobox.Clear
        ref={ref}
        className={joinClassNames('notable-combobox__clear', className)}
        aria-label={props['aria-label'] ?? 'Clear selection'}
        {...props}
      >
        {children ?? <X size={16} aria-hidden="true" />}
      </BaseCombobox.Clear>
    );
  },
);

const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  function ComboboxContent(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="notable-combobox__positioner"
        >
          <BaseCombobox.Popup
            ref={ref}
            className={joinClassNames(
              'notable-combobox__popup notable-floating-surface',
              className,
            )}
            {...props}
          >
            <AnimatedHighlight />
            {children}
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    );
  },
);

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  function ComboboxItem({ className, ...props }, ref) {
    return (
      <BaseCombobox.Item
        ref={ref}
        className={joinClassNames('notable-combobox__item', className)}
        {...props}
      />
    );
  },
);

const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  function ComboboxList({ className, children, ...props }, ref) {
    const renderOption =
      children ??
      ((option: ComboboxOption) => (
        <ComboboxItem value={option.value} disabled={option.disabled}>
          {option.label}
        </ComboboxItem>
      ));

    return (
      <BaseCombobox.List
        ref={ref}
        className={joinClassNames('notable-combobox__list', className)}
        {...props}
      >
        {(entry: ComboboxOption | ComboboxOptionGroup, index: number) =>
          isOptionGroup(entry) ? (
            <BaseCombobox.Group
              key={entry.label}
              items={entry.items}
              className="notable-combobox__group"
            >
              <BaseCombobox.GroupLabel className="notable-combobox__group-label">
                {entry.label}
              </BaseCombobox.GroupLabel>
              <BaseCombobox.Collection>
                {(option: ComboboxOption, optionIndex: number) => (
                  <Fragment key={option.value}>
                    {renderOption(option, optionIndex)}
                  </Fragment>
                )}
              </BaseCombobox.Collection>
            </BaseCombobox.Group>
          ) : (
            <Fragment key={entry.value}>{renderOption(entry, index)}</Fragment>
          )
        }
      </BaseCombobox.List>
    );
  },
);

const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  function ComboboxEmpty({ className, ...props }, ref) {
    return (
      <BaseCombobox.Empty
        ref={ref}
        className={joinClassNames('notable-combobox__empty', className)}
        {...props}
      />
    );
  },
);

const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  function ComboboxGroup({ className, ...props }, ref) {
    return (
      <BaseCombobox.Group
        ref={ref}
        className={joinClassNames('notable-combobox__group', className)}
        {...props}
      />
    );
  },
);

const ComboboxGroupLabel = forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  function ComboboxGroupLabel({ className, ...props }, ref) {
    return (
      <BaseCombobox.GroupLabel
        ref={ref}
        className={joinClassNames('notable-combobox__group-label', className)}
        {...props}
      />
    );
  },
);

const ComboboxSeparator = forwardRef<HTMLDivElement, ComboboxSeparatorProps>(
  function ComboboxSeparator({ className, ...props }, ref) {
    return (
      <BaseCombobox.Separator
        ref={ref}
        className={joinClassNames('notable-combobox__separator', className)}
        {...props}
      />
    );
  },
);

/**
 * Searchable single-select combobox. Compose it with `Combobox.Input`,
 * `Combobox.Content`, `Combobox.List`, and `Combobox.Item`.
 */
export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Content: ComboboxContent,
  List: ComboboxList,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
});
