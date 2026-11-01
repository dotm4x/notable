import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import {
  DURATION_BASE,
  EASING_STANDARD,
  SPRING_LAYOUT,
} from '../../styles/motion.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import './table-of-contents.css';

/** Supported placement of the table of contents relative to its content. */
export type TableOfContentsSide = 'left' | 'right';

/** Props for the navigation landmark rendered by {@link TableOfContents.Root}. */
export type TableOfContentsRootProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  /** Side on which the table of contents is placed. Defaults to `left`. */
  side?: TableOfContentsSide;
};

/** Props for `TableOfContents.Header`, rendered as a level-two heading. */
export type TableOfContentsHeaderProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `TableOfContents.List`, rendered as a list of items. */
export type TableOfContentsListProps = HTMLAttributes<HTMLUListElement>;

/** Props for `TableOfContents.Item`, including its link label and nested list. */
export type TableOfContentsItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> & {
  /** Fragment URL of the section this item links to. */
  href: string;
  /** Visible label for the section link. */
  label: ReactNode;
  /** Optional nested `TableOfContents.List`. */
  children?: ReactNode;
};

type TableOfContentsContextValue = {
  activeId: string | null;
  handleLinkClick: (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => void;
  prefersReducedMotion: boolean;
  side: TableOfContentsSide;
};

const TableOfContentsContext =
  createContext<TableOfContentsContextValue | null>(null);

function getFragmentId(href: string) {
  if (!href.startsWith('#') || href.length === 1) {
    return null;
  }

  try {
    return decodeURIComponent(href.slice(1));
  } catch (error) {
    if (error instanceof URIError) {
      return null;
    }
    throw error;
  }
}

function useTableOfContentsContext() {
  const context = useContext(TableOfContentsContext);
  if (!context) {
    throw new Error(
      'TableOfContents.Item must be rendered inside TableOfContents.Root.',
    );
  }
  return context;
}

const TableOfContentsRoot = forwardRef<HTMLElement, TableOfContentsRootProps>(
  function TableOfContentsRoot(
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      side = 'left',
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLElement | null>(null);
    const lastClickRef = useRef<{ id: string; time: number } | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const prefersReducedMotion = useReducedMotion() ?? false;
    const indicatorId = useId();
    const setRootRef = useCallback(
      (node: HTMLElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      const root = rootRef.current;
      if (!root || typeof IntersectionObserver === 'undefined') {
        return;
      }

      const targets = new Map<Element, string>();
      root
        .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
        .forEach((link) => {
          const id = getFragmentId(link.getAttribute('href') ?? '');
          if (id) {
            const target = document.getElementById(id);
            if (target) {
              targets.set(target, id);
            }
          }
        });

      if (targets.size === 0) {
        return;
      }

      const visibleTargets = new Map<Element, number>();
      const targetTops = new Map<Element, number>();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            targetTops.set(entry.target, entry.boundingClientRect.top);
            if (entry.isIntersecting) {
              visibleTargets.set(entry.target, entry.boundingClientRect.top);
            } else {
              visibleTargets.delete(entry.target);
            }
          });

          let activeTarget: Element | undefined = [
            ...visibleTargets.entries(),
          ].sort(([, firstTop], [, secondTop]) => firstTop - secondTop)[0]?.[0];

          // When nothing sits in the active band (e.g. at the very bottom of the
          // page), activate the last section only when the page is actually
          // scrolled to its end. Otherwise keep the last section that has
          // scrolled past the top, so non-final trailing sections can become
          // active without being overridden by the final one.
          if (!activeTarget) {
            const atBottom =
              window.scrollY + window.innerHeight >=
              document.documentElement.scrollHeight - 8;
            if (atBottom) {
              activeTarget = [...targets.keys()][targets.size - 1];
            } else {
              const passed = [...targetTops.entries()]
                .filter(([, top]) => top <= 0)
                .sort(
                  ([, firstTop], [, secondTop]) => secondTop - firstTop,
                )[0]?.[0];
              activeTarget = passed;
            }
          }

          // After a manual selection, ignore observer-driven updates briefly so
          // the chosen item stays active even when the page cannot scroll far
          // enough to bring it into the active band.
          if (
            lastClickRef.current &&
            Date.now() - lastClickRef.current.time < 1200
          ) {
            return;
          }

          const nextId = activeTarget
            ? (targets.get(activeTarget) ?? null)
            : null;
          if (nextId) {
            setActiveId(nextId);
          }
        },
        { rootMargin: '-15% 0px -75% 0px' },
      );

      targets.forEach((_, target) => observer.observe(target));
      return () => observer.disconnect();
    }, [children]);

    const handleLinkClick = useCallback(
      (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (event.currentTarget.target !== '' &&
            event.currentTarget.target.toLowerCase() !== '_self') ||
          event.currentTarget.hasAttribute('download')
        ) {
          return;
        }

        const id = getFragmentId(href);
        const target = id ? document.getElementById(id) : null;
        if (!target) {
          return;
        }

        event.preventDefault();
        if (id) {
          lastClickRef.current = { id, time: Date.now() };
        }
        setActiveId(id);
        if (window.location.hash !== href) {
          window.history.pushState(null, '', href);
        }

        const behavior: ScrollBehavior = prefersReducedMotion
          ? 'auto'
          : 'smooth';
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior });
      },
      [prefersReducedMotion],
    );

    return (
      <TableOfContentsContext.Provider
        value={{
          activeId,
          handleLinkClick,
          prefersReducedMotion,
          side,
        }}
      >
        <LayoutGroup id={indicatorId}>
          <nav
            {...props}
            ref={setRootRef}
            aria-label={
              ariaLabel ?? (ariaLabelledBy ? undefined : 'On this page')
            }
            aria-labelledby={ariaLabelledBy}
            className={[
              'notable-table-of-contents',
              side === 'right' ? 'notable-table-of-contents--right' : null,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <AnimatedHighlight className="notable-table-of-contents__highlight" />
            {children}
          </nav>
        </LayoutGroup>
      </TableOfContentsContext.Provider>
    );
  },
);

const TableOfContentsHeader = forwardRef<
  HTMLHeadingElement,
  TableOfContentsHeaderProps
>(function TableOfContentsHeader({ className, ...props }, ref) {
  return (
    <h2
      {...props}
      ref={ref}
      className={['notable-table-of-contents__header', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const TableOfContentsList = forwardRef<
  HTMLUListElement,
  TableOfContentsListProps
>(function TableOfContentsList({ className, ...props }, ref) {
  return (
    <ul
      {...props}
      ref={ref}
      className={['notable-table-of-contents__list', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

const TableOfContentsItem = forwardRef<
  HTMLAnchorElement,
  TableOfContentsItemProps
>(function TableOfContentsItem(
  { children, className, href, label, onClick, ...props },
  ref,
) {
  const { activeId, handleLinkClick, prefersReducedMotion, side } =
    useTableOfContentsContext();
  const [hovered, setHovered] = useState(false);
  const id = getFragmentId(href);
  const isActive = id !== null && activeId === id;

  return (
    <li className="notable-table-of-contents__item">
      <a
        {...props}
        ref={ref}
        href={href}
        aria-current={isActive ? 'location' : undefined}
        data-active={isActive ? '' : undefined}
        data-highlighted={hovered ? '' : undefined}
        className={['notable-table-of-contents__link', className]
          .filter(Boolean)
          .join(' ')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(event) => {
          onClick?.(event);
          handleLinkClick(event, href);
        }}
      >
        {isActive && (
          <motion.span
            aria-hidden="true"
            className="notable-table-of-contents__indicator"
            layoutId="active-indicator"
            initial={false}
            transition={prefersReducedMotion ? { duration: 0 } : SPRING_LAYOUT}
          />
        )}
        <motion.span
          className="notable-table-of-contents__label"
          animate={{ x: isActive ? (side === 'right' ? -2 : 2) : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: DURATION_BASE, ease: EASING_STANDARD }
          }
        >
          {label}
        </motion.span>
      </a>
      {children}
    </li>
  );
});

export interface TableOfContentsComponent extends React.ForwardRefExoticComponent<
  TableOfContentsRootProps & React.RefAttributes<HTMLElement>
> {
  /** Navigation landmark that observes its linked sections. */
  Root: typeof TableOfContentsRoot;
  /** Visible heading for the navigation landmark. */
  Header: typeof TableOfContentsHeader;
  /** List container for section links; nest it inside an item for sub-sections. */
  List: typeof TableOfContentsList;
  /** Section anchor and optional nested list. */
  Item: typeof TableOfContentsItem;
}

/** Composable section navigation with automatic active-section tracking. */
export const TableOfContents: TableOfContentsComponent = Object.assign(
  TableOfContentsRoot,
  {
    Root: TableOfContentsRoot,
    Header: TableOfContentsHeader,
    List: TableOfContentsList,
    Item: TableOfContentsItem,
  },
);
