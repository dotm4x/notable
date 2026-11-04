import { forwardRef } from 'react';
import { PaginationContext } from '../context.js';
import type { TPaginationContextValue } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from './controls.js';
import { PaginationItems } from './items.js';
import type { TPaginationProps } from '../types.js';

const DEFAULT_SIBLING_COUNT = 1;

export const PaginationRoot = forwardRef<HTMLElement, TPaginationProps>(
  function PaginationRoot(
    {
      page,
      pageCount,
      onPageChange,
      siblingCount = DEFAULT_SIBLING_COUNT,
      showFirstLast = false,
      disabled = false,
      size = 'medium',
      children,
      className,
      ...props
    },
    ref,
  ) {
    const currentPage = Math.min(
      Math.max(Math.floor(page), 1),
      Math.max(pageCount, 1),
    );

    const goToPage = (target: number) => {
      if (
        disabled ||
        target === currentPage ||
        target < 1 ||
        target > pageCount
      ) {
        return;
      }
      onPageChange?.(target);
    };

    const context: TPaginationContextValue = {
      currentPage,
      pageCount,
      siblingCount: Math.max(0, Math.floor(siblingCount)),
      disabled,
      goToPage,
    };

    return (
      <PaginationContext.Provider value={context}>
        <nav
          ref={ref}
          aria-label="Pagination"
          {...props}
          className={joinClassNames(
            'one-pagination',
            `one-pagination--${size}`,
            className,
          )}
          data-disabled={disabled || undefined}
        >
          {children ?? (
            <>
              {showFirstLast && <PaginationFirst />}
              <PaginationPrevious />
              <PaginationItems />
              <PaginationNext />
              {showFirstLast && <PaginationLast />}
            </>
          )}
        </nav>
      </PaginationContext.Provider>
    );
  },
);
