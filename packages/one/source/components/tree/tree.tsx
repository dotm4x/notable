'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MutableRefObject,
} from 'react';
import { joinClassNames } from '../../internal/helpers/join-class-names.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { useHighlightTarget } from '../../internal/primitives/animated-highlight/use-highlight-target.js';
import {
  TreeContext,
  TreeHighlightContext,
  type TTreeContextValue,
} from './context.js';
import { getAncestorIds, findFirstId } from './helpers/tree.js';
import { TreeItem } from './parts/item.js';
import type { TTreeProps } from './types.js';
import './tree.css';

function scheduleFocus(callback: () => void) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * A data-driven navigation tree with disclosure branches, native links,
 * keyboard navigation, and typeahead. It uses the same visual language as
 * `Sidebar`, but can be used anywhere.
 */
export const Tree = forwardRef<HTMLUListElement, TTreeProps>(function Tree(
  {
    items,
    activeId,
    expandedIds,
    defaultExpandedIds,
    onExpandedChange,
    autoExpandActive = true,
    compact = false,
    onNavigate,
    onAction,
    onCompactBranchClick,
    className,
    onFocus,
    onKeyDown,
    ...props
  },
  ref,
) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const highlightEnabled = useContext(TreeHighlightContext);
  const expandedRef = useRef<string[]>([]);
  const lastAutoExpand = useRef<string | null>(null);
  const typeaheadBuffer = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const {
    handlePointerOver,
    handlePointerLeave,
    handleFocusCapture,
    handleBlurCapture,
  } = useHighlightTarget({
    enabled: highlightEnabled,
    containerRef: rootRef,
    selector: '.one-tree__row',
  });

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(
    () =>
      defaultExpandedIds ??
      (autoExpandActive && activeId ? getAncestorIds(items, activeId) : []),
  );
  const expanded = expandedIds ?? uncontrolledExpanded;
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  expandedRef.current = expanded;

  const [focusId, setFocusId] = useState<string | null>(
    activeId ?? findFirstId(items) ?? null,
  );
  const firstId = findFirstId(items);
  const tabbableId = focusId ?? activeId ?? firstId;

  const setListRef = useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLUListElement | null>).current = node;
      }
    },
    [ref],
  );

  const setExpanded = useCallback(
    (id: string, open: boolean) => {
      const next = new Set(expandedRef.current);

      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }

      const nextIds = [...next];
      expandedRef.current = nextIds;

      if (expandedIds === undefined) {
        setUncontrolledExpanded(nextIds);
      }

      onExpandedChange?.(nextIds);
    },
    [expandedIds, onExpandedChange],
  );

  useEffect(() => {
    if (!autoExpandActive || !activeId) {
      return;
    }

    if (lastAutoExpand.current === activeId) {
      return;
    }

    lastAutoExpand.current = activeId;
    const ancestors = getAncestorIds(items, activeId);

    if (ancestors.length === 0) {
      return;
    }

    const next = new Set(expandedRef.current);
    let changed = false;

    for (const id of ancestors) {
      if (!next.has(id)) {
        next.add(id);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    const nextIds = [...next];
    expandedRef.current = nextIds;

    if (expandedIds === undefined) {
      setUncontrolledExpanded(nextIds);
    }

    onExpandedChange?.(nextIds);
  }, [activeId, autoExpandActive, items, expandedIds, onExpandedChange]);

  useEffect(() => {
    if (activeId) {
      setFocusId(activeId);
    }
  }, [activeId]);

  useEffect(
    () => () => {
      clearTimeout(typeaheadTimer.current);
    },
    [],
  );

  const getVisibleRows = useCallback(() => {
    const root = listRef.current;

    if (!root) {
      return [];
    }

    return Array.from(
      root.querySelectorAll<HTMLElement>('[data-tree-row]'),
    ).filter(
      (row) =>
        !row.closest('[hidden]') &&
        !row.closest('[inert]') &&
        !row.matches(':disabled, [aria-disabled="true"]'),
    );
  }, []);

  const focusRow = useCallback(
    (id: string | undefined) => {
      if (!id) {
        return;
      }

      scheduleFocus(() => {
        const row = getVisibleRows().find(
          (candidate) => candidate.dataset.treeId === id,
        );
        row?.focus();
      });
    },
    [getVisibleRows],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLUListElement>) => {
      const row = (event.target as Element).closest<HTMLElement>(
        '[data-tree-row]',
      );

      if (row?.dataset.treeId) {
        setFocusId(row.dataset.treeId);
      }

      onFocus?.(event);
    },
    [onFocus],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const row = (event.target as Element).closest<HTMLElement>(
        '[data-tree-row]',
      );

      if (!row) {
        return;
      }

      const rows = getVisibleRows();
      const index = rows.indexOf(row);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusRow(rows[Math.min(index + 1, rows.length - 1)]?.dataset.treeId);
          return;
        case 'ArrowUp':
          event.preventDefault();
          focusRow(rows[Math.max(index - 1, 0)]?.dataset.treeId);
          return;
        case 'Home':
          event.preventDefault();
          focusRow(rows[0]?.dataset.treeId);
          return;
        case 'End':
          event.preventDefault();
          focusRow(rows[rows.length - 1]?.dataset.treeId);
          return;
        case 'ArrowRight': {
          event.preventDefault();
          const isExpanded = row.getAttribute('aria-expanded');

          if (isExpanded === 'false') {
            row.click();
            return;
          }

          if (isExpanded === 'true') {
            const item = row.closest('li');
            const group = item?.querySelector<HTMLElement>('.one-tree__group');
            const child = group?.querySelector<HTMLElement>(
              '[data-tree-row]:not([aria-disabled="true"])',
            );
            focusRow(child?.dataset.treeId);
          }

          return;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          const isExpanded = row.getAttribute('aria-expanded');

          if (isExpanded === 'true') {
            row.click();
            return;
          }

          const item = row.closest('li');
          const parentItem = item?.parentElement?.closest('li');
          const parentRow =
            parentItem?.querySelector<HTMLElement>('[data-tree-row]');
          focusRow(parentRow?.dataset.treeId);
          return;
        }
        default:
          break;
      }

      if (
        event.key.length === 1 &&
        event.key !== ' ' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        typeaheadBuffer.current += event.key.toLowerCase();
        clearTimeout(typeaheadTimer.current);
        typeaheadTimer.current = setTimeout(() => {
          typeaheadBuffer.current = '';
        }, 500);

        const ordered = [...rows.slice(index + 1), ...rows.slice(0, index + 1)];
        const match = ordered.find((candidate) =>
          (candidate.dataset.treeText ?? '')
            .toLowerCase()
            .startsWith(typeaheadBuffer.current),
        );

        if (match) {
          focusRow(match.dataset.treeId);
        }
      }
    },
    [focusRow, getVisibleRows, onKeyDown],
  );

  const context = useMemo<TTreeContextValue>(
    () => ({
      activeId,
      compact,
      expanded: expandedSet,
      focusId,
      setFocusId,
      setExpanded,
      onNavigate,
      onAction,
      onCompactBranchClick,
      tabbableId,
    }),
    [
      activeId,
      compact,
      expandedSet,
      focusId,
      onNavigate,
      onAction,
      onCompactBranchClick,
      setExpanded,
      tabbableId,
    ],
  );

  return (
    <TreeContext.Provider value={context}>
      <div
        ref={rootRef}
        className="one-tree-root"
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        {highlightEnabled ? (
          <AnimatedHighlight
            className="one-tree__highlight"
            followTargetShape
          />
        ) : null}
        <ul
          {...props}
          ref={setListRef}
          className={joinClassNames(
            'one-tree',
            compact && 'one-tree--compact',
            className,
          )}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          {items.map((node) => (
            <TreeItem key={node.id} level={1} node={node} />
          ))}
        </ul>
      </div>
    </TreeContext.Provider>
  );
});

export type { TreeNode, TTreeProps } from './types.js';
