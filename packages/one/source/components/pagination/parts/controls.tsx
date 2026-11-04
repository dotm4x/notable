import type { ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '../../../icons';
import { usePaginationContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { TPaginationControlProps } from '../types.js';

export function PaginationControl({
  className,
  disabled,
  ...props
}: TPaginationControlProps) {
  const context = usePaginationContext('Control');
  return (
    <button
      type="button"
      {...props}
      className={joinClassNames('one-pagination__control', className)}
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
      className={joinClassNames('one-pagination__edge', className)}
    >
      {children ?? icon}
    </PaginationControl>
  );
}

export function PaginationFirst(props: TPaginationControlProps) {
  const { currentPage, goToPage } = usePaginationContext('First');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to first page"
      icon={
        <ChevronsLeft aria-hidden="true" className="one-pagination__icon" />
      }
      boundaryDisabled={currentPage <= 1}
      onNavigate={() => goToPage(1)}
    />
  );
}

export function PaginationPrevious(props: TPaginationControlProps) {
  const { currentPage, goToPage } = usePaginationContext('Previous');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to previous page"
      icon={<ChevronLeft aria-hidden="true" className="one-pagination__icon" />}
      boundaryDisabled={currentPage <= 1}
      onNavigate={() => goToPage(currentPage - 1)}
    />
  );
}

export function PaginationNext(props: TPaginationControlProps) {
  const { currentPage, pageCount, goToPage } = usePaginationContext('Next');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to next page"
      icon={
        <ChevronRight aria-hidden="true" className="one-pagination__icon" />
      }
      boundaryDisabled={currentPage >= pageCount}
      onNavigate={() => goToPage(currentPage + 1)}
    />
  );
}

export function PaginationLast(props: TPaginationControlProps) {
  const { currentPage, pageCount, goToPage } = usePaginationContext('Last');
  return (
    <PaginationEdgeControl
      {...props}
      defaultLabel="Go to last page"
      icon={
        <ChevronsRight aria-hidden="true" className="one-pagination__icon" />
      }
      boundaryDisabled={currentPage >= pageCount}
      onNavigate={() => goToPage(pageCount)}
    />
  );
}
