import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination.js';

function getPageNumbers(container: HTMLElement) {
  return within(container)
    .getAllByRole('button', { name: /^Page \d+$/ })
    .map((button) => button.textContent);
}

describe('Pagination', () => {
  describe('Rendering', () => {
    it('renders a navigation landmark named Pagination by default', () => {
      render(<Pagination page={1} pageCount={5} />);

      expect(
        screen.getByRole('navigation', { name: 'Pagination' }),
      ).toBeInTheDocument();
    });

    it('lets consumers override the navigation label', () => {
      render(
        <Pagination aria-label="Search results pages" page={1} pageCount={5} />,
      );

      expect(
        screen.getByRole('navigation', { name: 'Search results pages' }),
      ).toBeInTheDocument();
    });

    it('renders every page when the count is small', () => {
      render(<Pagination page={2} pageCount={3} />);

      expect(
        screen.getByRole('button', { name: 'Page 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Page 2' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Page 3' }),
      ).toBeInTheDocument();
    });

    it('renders no page numbers when there are no pages', () => {
      render(<Pagination page={1} pageCount={0} />);

      expect(
        screen.queryByRole('button', { name: /^Page \d+$/ }),
      ).not.toBeInTheDocument();
    });

    it('renders ellipses for omitted pages and keeps them out of the accessibility tree', () => {
      const { container } = render(<Pagination page={10} pageCount={20} />);

      const ellipses = container.querySelectorAll(
        '.notable-pagination__ellipsis',
      );
      expect(ellipses).toHaveLength(2);
      ellipses.forEach((ellipsis) => {
        expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('shows only the current page as the current page', () => {
      render(<Pagination page={3} pageCount={5} />);

      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(
        screen.getByRole('button', { name: 'Page 2' }),
      ).not.toHaveAttribute('aria-current');
    });

    it('clamps an out-of-range page for display', () => {
      render(<Pagination page={99} pageCount={5} />);

      expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('renders first and last controls only when requested', () => {
      const { rerender } = render(<Pagination page={2} pageCount={5} />);
      expect(
        screen.queryByRole('button', { name: 'Go to first page' }),
      ).not.toBeInTheDocument();

      rerender(<Pagination showFirstLast page={2} pageCount={5} />);
      expect(
        screen.getByRole('button', { name: 'Go to first page' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Go to last page' }),
      ).toBeInTheDocument();
    });

    it('applies the size modifier class', () => {
      const { container } = render(
        <Pagination page={1} pageCount={5} size="small" />,
      );

      expect(container.querySelector('nav')).toHaveClass(
        'notable-pagination--small',
      );
    });

    it('forwards a ref to the navigation element', () => {
      const ref = createRef<HTMLElement>();
      render(<Pagination ref={ref} page={1} pageCount={5} />);

      expect(ref.current).toBe(screen.getByRole('navigation'));
    });

    it('merges custom classes with the component class', () => {
      const { container } = render(
        <Pagination className="custom-pagination" page={1} pageCount={5} />,
      );

      expect(container.querySelector('nav')).toHaveClass(
        'notable-pagination',
        'custom-pagination',
      );
    });
  });

  describe('Page navigation', () => {
    it('calls onPageChange with the page that was selected', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'Page 4' }));

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('does not call onPageChange when the current page is selected', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'Page 2' }));

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('moves to the previous and next pages', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);

      await user.click(
        screen.getByRole('button', { name: 'Go to previous page' }),
      );
      expect(onPageChange).toHaveBeenLastCalledWith(2);

      await user.click(screen.getByRole('button', { name: 'Go to next page' }));
      expect(onPageChange).toHaveBeenLastCalledWith(4);
    });

    it('moves to the first and last pages', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination
          showFirstLast
          page={3}
          pageCount={5}
          onPageChange={onPageChange}
        />,
      );

      await user.click(
        screen.getByRole('button', { name: 'Go to first page' }),
      );
      expect(onPageChange).toHaveBeenLastCalledWith(1);

      await user.click(screen.getByRole('button', { name: 'Go to last page' }));
      expect(onPageChange).toHaveBeenLastCalledWith(5);
    });

    it('disables previous and first controls on the first page', () => {
      render(<Pagination showFirstLast page={1} pageCount={5} />);

      expect(
        screen.getByRole('button', { name: 'Go to first page' }),
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Go to previous page' }),
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Go to next page' }),
      ).toBeEnabled();
    });

    it('disables next and last controls on the last page', () => {
      render(<Pagination showFirstLast page={5} pageCount={5} />);

      expect(
        screen.getByRole('button', { name: 'Go to next page' }),
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Go to last page' }),
      ).toBeDisabled();
    });

    it('does not navigate to an out-of-range page from a control', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination
          showFirstLast
          page={5}
          pageCount={5}
          onPageChange={onPageChange}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Go to next page' }));
      await user.click(screen.getByRole('button', { name: 'Go to last page' }));

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('disables every control and prevents page changes', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const { container } = render(
        <Pagination
          disabled
          showFirstLast
          page={3}
          pageCount={5}
          onPageChange={onPageChange}
        />,
      );

      within(container)
        .getAllByRole('button')
        .forEach((button) => {
          expect(button).toBeDisabled();
        });

      await user.click(screen.getByRole('button', { name: 'Page 1' }));
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('exposes the disabled state on the root', () => {
      const { container } = render(
        <Pagination disabled page={1} pageCount={5} />,
      );

      expect(container.querySelector('nav')).toHaveAttribute('data-disabled');
    });
  });

  describe('Keyboard', () => {
    it('activates a page with Enter from the keyboard', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);

      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Go to previous page' }),
      ).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('activates a page with Space from the keyboard', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus();

      await user.keyboard(' ');
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('skips disabled controls when tabbing', async () => {
      const user = userEvent.setup();
      render(<Pagination showFirstLast page={1} pageCount={3} />);

      await user.tab();
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus();
    });
  });

  describe('Controlled state', () => {
    it('keeps the displayed page controlled by the parent', async () => {
      const user = userEvent.setup();
      function ControlledPagination() {
        const [page, setPage] = useState(1);
        return (
          <>
            <Pagination page={page} pageCount={5} onPageChange={setPage} />
            <output>Current: {page}</output>
          </>
        );
      }
      render(<ControlledPagination />);

      await user.click(screen.getByRole('button', { name: 'Go to next page' }));

      expect(screen.getByText('Current: 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('does not change its own page when the parent rejects a change', async () => {
      const user = userEvent.setup();
      render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);

      await user.click(screen.getByRole('button', { name: 'Page 3' }));

      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  describe('Dynamic values', () => {
    it('updates the range when the page count changes', () => {
      const { rerender } = render(<Pagination page={1} pageCount={5} />);
      expect(
        screen.queryByRole('button', { name: 'Page 6' }),
      ).not.toBeInTheDocument();

      rerender(<Pagination page={1} pageCount={12} />);
      expect(
        screen.getByRole('button', { name: 'Page 12' }),
      ).toBeInTheDocument();
    });

    it('updates the range when the sibling count changes', () => {
      const { container, rerender } = render(
        <Pagination page={10} pageCount={20} siblingCount={1} />,
      );
      expect(getPageNumbers(container)).toEqual(['1', '9', '10', '11', '20']);

      rerender(<Pagination page={10} pageCount={20} siblingCount={0} />);
      expect(getPageNumbers(container)).toEqual(['1', '10', '20']);
    });

    it('moves the current page indicator with the page', () => {
      const { container, rerender } = render(
        <Pagination page={1} pageCount={5} />,
      );
      rerender(<Pagination page={4} pageCount={5} />);

      const current = container.querySelector('[aria-current="page"]');
      expect(current).toHaveTextContent('4');
    });
  });

  describe('Composition', () => {
    it('renders composed parts in place of the default layout', () => {
      render(
        <Pagination page={2} pageCount={5}>
          <Pagination.Previous>Back</Pagination.Previous>
          <Pagination.Items />
          <Pagination.Next>Forward</Pagination.Next>
        </Pagination>,
      );

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Forward' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('lets composed controls use the shared navigation behavior', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination page={2} pageCount={5} onPageChange={onPageChange}>
          <Pagination.First>First</Pagination.First>
          <Pagination.Last>Last</Pagination.Last>
        </Pagination>,
      );

      await user.click(screen.getByRole('button', { name: 'First' }));
      expect(onPageChange).toHaveBeenLastCalledWith(1);

      await user.click(screen.getByRole('button', { name: 'Last' }));
      expect(onPageChange).toHaveBeenLastCalledWith(5);
    });

    it('calls a consumer onClick handler without losing navigation', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const onClick = vi.fn();
      render(
        <Pagination page={2} pageCount={5} onPageChange={onPageChange}>
          <Pagination.Next onClick={onClick}>Next</Pagination.Next>
        </Pagination>,
      );

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('throws when a part is rendered outside Pagination', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<Pagination.Next />)).toThrow(
        'Pagination.Next must be rendered inside Pagination.',
      );

      consoleError.mockRestore();
    });
  });

  describe('Multiple instances', () => {
    it('keeps independent instances separate', async () => {
      const user = userEvent.setup();
      const onTopChange = vi.fn();
      const onBottomChange = vi.fn();
      render(
        <>
          <Pagination
            aria-label="Top"
            page={1}
            pageCount={5}
            onPageChange={onTopChange}
          />
          <Pagination
            aria-label="Bottom"
            page={5}
            pageCount={5}
            onPageChange={onBottomChange}
          />
        </>,
      );

      await user.click(
        within(screen.getByRole('navigation', { name: 'Top' })).getByRole(
          'button',
          { name: 'Page 3' },
        ),
      );

      expect(onTopChange).toHaveBeenCalledWith(3);
      expect(onBottomChange).not.toHaveBeenCalled();
    });
  });
});
