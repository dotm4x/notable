import { forwardRef } from 'react';
import { ChevronDown } from '../../icons/index.js';
import { joinClassNames } from '../../internal/helpers/join-class-names.js';
import { Collapsible } from '../collapsible/collapsible.js';
import type { TDisclosureProps } from './types.js';
import './disclosure.css';

export type { TDisclosureProps } from './types.js';

/**
 * Renders a labeled section that expands to reveal secondary content, such as
 * raw markup, advanced options, or metadata. The trigger is a button that owns
 * its expanded state, so the content stays reachable without a mouse.
 *
 * Reach for `Disclosure` for one independent section, `Accordion` for a set of
 * related sections, and `Collapsible` when the trigger needs a custom design.
 */
export const Disclosure = forwardRef<HTMLDivElement, TDisclosureProps>(
  function Disclosure({ children, className, title, ...props }, ref) {
    return (
      <Collapsible
        {...props}
        ref={ref}
        className={joinClassNames('one-disclosure', className)}
      >
        <Collapsible.Trigger className="one-disclosure__trigger">
          <span className="one-disclosure__title">{title}</span>
          <ChevronDown aria-hidden="true" className="one-disclosure__chevron" />
        </Collapsible.Trigger>
        <Collapsible.Content className="one-disclosure__content">
          {children}
        </Collapsible.Content>
      </Collapsible>
    );
  },
);
