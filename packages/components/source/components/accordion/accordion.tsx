import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import './accordion.css';

type AccordionBaseProps = {
  /** Accordion items, rendered with `Accordion.Item`. */
  children: ReactNode;
  /** Additional CSS class for the root element. */
  className?: string;
  /** Disables every item. Defaults to `false`. */
  disabled?: boolean;
};

/** Props for {@link Accordion} in single mode, where at most one item is expanded. */
export type AccordionSingleProps = AccordionBaseProps & {
  type: 'single';
  /**
   * Value of the expanded item, or `null` when none is expanded. Omit the
   * prop entirely to let the accordion manage its own state.
   */
  value?: string | null;
  /** Expanded item in uncontrolled mode. Defaults to `null`. */
  defaultValue?: string | null;
  /** Called with the value of the newly expanded item, or `null` when it collapses. */
  onValueChange?: (value: string | null) => void;
};

/** Props for {@link Accordion} in multiple mode, where any number of items may be expanded. */
export type AccordionMultipleProps = AccordionBaseProps & {
  type: 'multiple';
  /** Values of the expanded items. Omit the prop to let the accordion manage its own state. */
  value?: string[];
  /** Expanded items in uncontrolled mode. Defaults to `[]`. */
  defaultValue?: string[];
  /** Called with the values of all expanded items after each change. */
  onValueChange?: (value: string[]) => void;
};

/** Props for {@link Accordion}. */
export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/** Props for `Accordion.Item`. */
export type AccordionItemProps = {
  /** Content shown when the item is expanded. */
  children: ReactNode;
  /** Additional CSS class for the item element. */
  className?: string;
  /** Prevents the item from being toggled. Defaults to `false`. */
  disabled?: boolean;
  /** Trigger label. */
  title: ReactNode;
  /** Stable identifier used for expansion state. */
  value: string;
};

function toExpandedValues(
  value: string | readonly string[] | null | undefined,
): string[] {
  if (value == null) {
    return [];
  }

  return typeof value === 'string' ? [value] : [...value];
}

/**
 * Groups collapsible sections. In single mode, expanding an item collapses
 * the previously expanded one, and activating the expanded item collapses it.
 */
function AccordionRoot(props: AccordionProps) {
  const { children, className, disabled = false } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const classes = ['notable-accordion', className].filter(Boolean).join(' ');

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    // Limit navigation to this accordion's own triggers, excluding nested accordions.
    const triggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        '[data-accordion-trigger]:not(:disabled)',
      ),
    ).filter((trigger) => trigger.closest('.notable-accordion') === root);
    const currentIndex = triggers.findIndex(
      (trigger) => trigger === event.target,
    );

    if (currentIndex === -1) {
      return;
    }

    let targetIndex: number;

    switch (event.key) {
      case 'ArrowDown':
        targetIndex = (currentIndex + 1) % triggers.length;
        break;
      case 'ArrowUp':
        targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = triggers.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    triggers[targetIndex]?.focus();
  };

  return (
    <BaseAccordion.Root
      ref={rootRef}
      className={classes}
      disabled={disabled}
      multiple={props.type === 'multiple'}
      value={
        props.value === undefined ? undefined : toExpandedValues(props.value)
      }
      defaultValue={toExpandedValues(props.defaultValue)}
      onKeyDown={handleKeyDown}
      onValueChange={(nextValues: string[]) => {
        if (props.type === 'single') {
          props.onValueChange?.(nextValues[0] ?? null);
        } else {
          props.onValueChange?.(nextValues);
        }
      }}
    >
      {children}
    </BaseAccordion.Root>
  );
}

/** A single expandable section of an {@link Accordion}, rendered as `Accordion.Item`. */
function AccordionItem({
  children,
  className,
  disabled = false,
  title,
  value,
}: AccordionItemProps) {
  const classes = ['notable-accordion__item', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseAccordion.Item className={classes} disabled={disabled} value={value}>
      <BaseAccordion.Header className="notable-accordion__heading">
        <BaseAccordion.Trigger
          className="notable-accordion__trigger"
          data-accordion-trigger
        >
          <span className="notable-accordion__title">{title}</span>
          <ChevronDown
            className="notable-accordion__chevron"
            aria-hidden="true"
          />
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel
        className="notable-accordion__panel"
        role="group"
        keepMounted
      >
        <div className="notable-accordion__content">
          <div className="notable-accordion__content-inner">{children}</div>
        </div>
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}

/** Compound accordion: `Accordion` is the root and `Accordion.Item` its items. */
export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
});
