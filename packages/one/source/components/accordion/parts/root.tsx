import { useRef, type KeyboardEvent } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { toExpandedValues } from '../helpers/state.js';
import type { AccordionProps } from '../types.js';

export function AccordionRoot(props: AccordionProps) {
  const { children, className, disabled = false } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const classes = ['one-accordion', className].filter(Boolean).join(' ');

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
    ).filter((trigger) => trigger.closest('.one-accordion') === root);
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
