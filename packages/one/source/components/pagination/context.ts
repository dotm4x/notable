import { createContext, useContext } from 'react';

export type TPaginationContextValue = {
  currentPage: number;
  pageCount: number;
  siblingCount: number;
  disabled: boolean;
  goToPage: (page: number) => void;
};

export const PaginationContext = createContext<TPaginationContextValue | null>(
  null,
);

export function usePaginationContext(part: string): TPaginationContextValue {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(`Pagination.${part} must be rendered inside Pagination.`);
  }
  return context;
}
