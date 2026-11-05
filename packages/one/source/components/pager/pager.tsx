import { forwardRef } from 'react';
import { ChevronLeft, ChevronRight } from '../../icons/index.js';
import { joinClassNames } from '../../internal/helpers/join-class-names.js';
import { Card } from '../card/card.js';
import type { TPagerItem, TPagerProps } from './types.js';
import './pager.css';

function PagerLink({
  direction,
  directionLabel,
  item,
}: {
  direction: 'previous' | 'next';
  directionLabel: string;
  item: TPagerItem;
}) {
  const isNext = direction === 'next';

  return (
    <a className="one-pager__link" data-direction={direction} href={item.href}>
      <Card className="one-pager__card">
        <Card.Header>
          <span className="one-pager__direction">
            {isNext ? null : <ChevronLeft aria-hidden="true" size={16} />}
            {directionLabel}
            {isNext ? <ChevronRight aria-hidden="true" size={16} /> : null}
          </span>
          <Card.Title as="p" className="one-pager__title">
            {item.label}
          </Card.Title>
        </Card.Header>
      </Card>
    </a>
  );
}

/**
 * Links to the previous and next destinations. It is designed for sequential
 * navigation such as documentation, not for numeric pagination.
 */
export const Pager = forwardRef<HTMLElement, TPagerProps>(function Pager(
  {
    previous,
    next,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    label = 'Pagination',
    className,
    ...props
  },
  ref,
) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={joinClassNames('one-pager', className)}
      {...props}
    >
      {previous ? (
        <PagerLink
          direction="previous"
          directionLabel={previousLabel}
          item={previous}
        />
      ) : null}
      {next ? (
        <PagerLink direction="next" directionLabel={nextLabel} item={next} />
      ) : null}
    </nav>
  );
});

export type { TPagerItem, TPagerProps } from './types.js';
