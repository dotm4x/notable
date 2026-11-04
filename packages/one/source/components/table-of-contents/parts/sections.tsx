import { motion } from 'motion/react';
import { forwardRef, useState } from 'react';
import {
  DURATION_BASE,
  EASING_STANDARD,
  SPRING_LAYOUT,
} from '../../../styles/motion.js';
import { useTableOfContentsContext } from '../context.js';
import { getFragmentId } from '../helpers/fragment.js';
import type {
  TableOfContentsHeaderProps,
  TableOfContentsItemProps,
  TableOfContentsListProps,
} from '../types.js';

export const TableOfContentsHeader = forwardRef<
  HTMLHeadingElement,
  TableOfContentsHeaderProps
>(function TableOfContentsHeader({ className, ...props }, ref) {
  return (
    <h2
      {...props}
      ref={ref}
      className={['one-table-of-contents__header', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

export const TableOfContentsList = forwardRef<
  HTMLUListElement,
  TableOfContentsListProps
>(function TableOfContentsList({ className, ...props }, ref) {
  return (
    <ul
      {...props}
      ref={ref}
      className={['one-table-of-contents__list', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});

export const TableOfContentsItem = forwardRef<
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
    <li className="one-table-of-contents__item">
      <a
        {...props}
        ref={ref}
        href={href}
        aria-current={isActive ? 'location' : undefined}
        data-active={isActive ? '' : undefined}
        data-highlighted={hovered ? '' : undefined}
        className={['one-table-of-contents__link', className]
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
            className="one-table-of-contents__indicator"
            layoutId="active-indicator"
            initial={false}
            transition={prefersReducedMotion ? { duration: 0 } : SPRING_LAYOUT}
          />
        )}
        <motion.span
          className="one-table-of-contents__label"
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
