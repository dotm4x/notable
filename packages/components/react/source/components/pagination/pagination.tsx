import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { getPaginationRange } from './pagination-range.js';
import './pagination.css';

/** Size of the page controls. */
export type TPaginationSize = 'small' | 'medium';

/** Props for the {@link Pagination} root, rendered as a navigation landmark. */
export type TPaginationProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children'
> & {
  /** The current page, counted from 1. Values outside the range are clamped for display only. */
  page: number;
  /** Total number of pages. Zero hides the page numbers. */
  pageCount: number;
  /** Called with the requested page. It is never called for the current page or an out-of-range page. */
  onPageChange?: (page: number) => void;
  /** Number of page numbers shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Adds first and last page controls to the default layout. */
  showFirstLast?: boolean;
  /** Prevents every page change. */
  disabled?: boolean;
  /** Size of the page controls. Defaults to `medium`. */
  size?: TPaginationSize;
  /** Replaces the default layout with composed parts. */
  children?: ReactNode;
};

/** Props for the navigation and page controls, which render native buttons. */
export type TPaginationControlProps = ComponentPropsWithoutRef<'button'>;

/** Props for `Pagination.Items`, the numbered pages and ellipses. */
export type TPaginationItemsProps = ComponentPropsWithoutRef<'div'>;

type TPaginationContextValue = {
  currentPage: number;
  pageCount: number;
  siblingCount: number;
  disabled: boolean;
  goToPage: (page: number) => void;
};

const PaginationContext = createContext<TPaginationContextValue | null>(null);

function usePaginationContext(part: string): TPaginationContextValue {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(`Pagination.${part} must be rendered inside Pagination.`);
  }
  return context;
}

const DEFAULT_SIBLING_COUNT = 1;

function joinClassNames(...classNames: (string | undefined | false)[]) {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Shows a set of pages and navigation controls for a controlled page. The
 * consumer owns the page state and decides what a page change does. With no
 * children it renders the default layout. Compose `Pagination.Previous`,
 * `Pagination.Items`, `Pagination.Next`, `Pagination.First`, and
 * `Pagination.Last` to change the arrangement. Forwards refs to the navigation
 * element.
 */
const PaginationRoot = forwardRef<HTMLElement, TPaginationProps>(
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
            'notable-pagination',
            `notable-pagination--${size}`,
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

function PaginationControl({
  className,
  disabled,
  ...props
}: TPaginationControlProps) {
  const context = usePaginationContext('Control');
  return (
    <button
      type="button"
      {...props}
      className={joinClassNames('notable-pagination__control', className)}
      disabled={context.disabled || disabled}
    />
  );
}

type TPaginationEdgeControlProps = TPaginationControlProps & {
  defaultLabel: string;
  icon: ReactNode;
  boundaryDisabled: boolean;
  onNavigate: () => void;
};

function PaginationEdgeControl({
  defaultLabel,
  icon,
  boundaryDisabled,
  onNavigate,
  onClick,
  className,
  children,
  disabled,
  ...props
}: TPaginationEdgeControlProps) {
  return (
    <PaginationControl
      aria-label={children ? undefined : defaultLabel}
      {...props}
      disabled={boundaryDisabled || disabled}
      onClick={(event) => {
        onClick?.(event);
        onNavigate();
      }}
      className={joinClassNames('notable-pagination__edge', className)}
    >
      {children ?? icon}
    </PaginationControl>
  );
}

function PaginationFirst(props: TPaginationControlProps) {
  const { currentPage, goToPage } = usePaginationContext('First');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to first page"
      icon={
        <ChevronsLeft aria-hidden="true" className="notable-pagination__icon" />
      }
      boundaryDisabled={currentPage <= 1}
      onNavigate={() => goToPage(1)}
    />
  );
}

function PaginationPrevious(props: TPaginationControlProps) {
  const { currentPage, goToPage } = usePaginationContext('Previous');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to previous page"
      icon={
        <ChevronLeft aria-hidden="true" className="notable-pagination__icon" />
      }
      boundaryDisabled={currentPage <= 1}
      onNavigate={() => goToPage(currentPage - 1)}
    />
  );
}

function PaginationNext(props: TPaginationControlProps) {
  const { currentPage, pageCount, goToPage } = usePaginationContext('Next');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to next page"
      icon={
        <ChevronRight aria-hidden="true" className="notable-pagination__icon" />
      }
      boundaryDisabled={currentPage >= pageCount}
      onNavigate={() => goToPage(currentPage + 1)}
    />
  );
}

function PaginationLast(props: TPaginationControlProps) {
  const { currentPage, pageCount, goToPage } = usePaginationContext('Last');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to last page"
      icon={
        <ChevronsRight
          aria-hidden="true"
          className="notable-pagination__icon"
        />
      }
      boundaryDisabled={currentPage >= pageCount}
      onNavigate={() => goToPage(pageCount)}
    />
  );
}

/**
 * The numbered pages around the current page, with ellipses for omitted
 * pages. The current page is marked with `aria-current` and tracked by a
 * single animated indicator.
 */
function PaginationItems({ className, ...props }: TPaginationItemsProps) {
  const { currentPage, pageCount, siblingCount, goToPage } =
    usePaginationContext('Items');
  const range = getPaginationRange(currentPage, pageCount, siblingCount);

  return (
    <div
      {...props}
      className={joinClassNames('notable-pagination__items', className)}
    >
      <AnimatedHighlight className="notable-pagination__indicator" />
      {range.map((item) => {
        if (item.type === 'ellipsis') {
          return (
            <span
              key={item.key}
              aria-hidden="true"
              className="notable-pagination__ellipsis"
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
            className="notable-pagination__page"
            onClick={() => goToPage(item.page)}
          >
            {item.page}
          </PaginationControl>
        );
      })}
    </div>
  );
}

export const Pagination = Object.assign(PaginationRoot, {
  First: PaginationFirst,
  Previous: PaginationPrevious,
  Items: PaginationItems,
  Next: PaginationNext,
  Last: PaginationLast,
});
