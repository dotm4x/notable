import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from '../../../icons';
import type { AccordionItemProps } from '../types.js';

export function AccordionItem({
  children,
  className,
  disabled = false,
  title,
  value,
}: AccordionItemProps) {
  const classes = ['one-accordion__item', className].filter(Boolean).join(' ');

  return (
    <BaseAccordion.Item className={classes} disabled={disabled} value={value}>
      <BaseAccordion.Header className="one-accordion__heading">
        <BaseAccordion.Trigger
          className="one-accordion__trigger"
          data-accordion-trigger
        >
          <span className="one-accordion__title">{title}</span>
          <ChevronDown className="one-accordion__chevron" aria-hidden="true" />
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel
        className="one-accordion__panel"
        role="group"
        keepMounted
      >
        <div className="one-accordion__content">
          <div className="one-accordion__content-inner">{children}</div>
        </div>
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}
