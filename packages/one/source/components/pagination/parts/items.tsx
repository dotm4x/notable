import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { usePaginationContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { getPaginationRange } from '../helpers/range.js';
import { PaginationControl } from './controls.js';
import type { TPaginationItemsProps } from '../types.js';

export function PaginationItems({
  className,
  ...props
}: TPaginationItemsProps) {
  const { currentPage, pageCount, siblingCount, goToPage } =
    usePaginationContext('Items');
  const range = getPaginationRange(currentPage, pageCount, siblingCount);

  return (
    <div
      {...props}
      className={joinClassNames('one-pagination__items', className)}
    >
      <AnimatedHighlight className="one-pagination__indicator" />
      {range.map((item) => {
        if (item.type === 'ellipsis') {
          return (
            <span
              key={item.key}
              aria-hidden="true"
              className="one-pagination__ellipsis"
            >
              …
            </span>
          );
        }
        const isCurrent = item.page === currentPage;
        return (
          <PaginationControl
            key={item.page}
            aria-label={`Page ${item.page}`}
            aria-current={isCurrent ? 'page' : undefined}
            data-highlighted={isCurrent || undefined}
            className="one-pagination__page"
            onClick={() => goToPage(item.page)}
          >
            {item.page}
          </PaginationControl>
        );
      })}
    </div>
  );
}
