'use client';

import { useId, useState, type ReactElement, type ReactNode } from 'react';
import { ChevronDown } from '../../../icons/index.js';
import { Collapsible } from '../../collapsible/collapsible.js';
import { Tooltip } from '../../tooltip/tooltip.js';
import { useTreeContext } from '../context.js';
import { getNodeText } from '../helpers/tree.js';
import type { TreeNode } from '../types.js';

function RowContent({
  branch,
  node,
  reserveIconSpace,
}: {
  branch: boolean;
  node: TreeNode;
  reserveIconSpace: boolean;
}): ReactNode {
  return (
    <>
      {node.icon ? (
        <span aria-hidden="true" className="one-tree__icon">
          {node.icon}
        </span>
      ) : reserveIconSpace ? (
        <span aria-hidden="true" className="one-tree__icon" />
      ) : null}
      <span className="one-tree__label">{node.label}</span>
      {branch ? (
        <ChevronDown aria-hidden="true" className="one-tree__chevron" />
      ) : null}
    </>
  );
}

function MaybeTooltip({
  compact,
  text,
  children,
}: {
  compact: boolean;
  text: string;
  children: ReactElement<{ 'aria-describedby'?: string }>;
}): ReactElement {
  if (!compact) {
    return children;
  }

  return (
    <Tooltip content={text} placement="right">
      {children}
    </Tooltip>
  );
}

export interface TreeItemProps {
  node: TreeNode;
  level: number;
  reserveIconSpace?: boolean;
}

/** Renders one navigation tree node and, recursively, its children. */
export function TreeItem({
  node,
  level,
  reserveIconSpace = false,
}: TreeItemProps) {
  const {
    activeId,
    compact,
    expanded,
    onAction,
    onNavigate,
    onCompactBranchClick,
    setExpanded,
    tabbableId,
  } = useTreeContext('TreeItem');
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const contentId = useId();

  const branch = Boolean(node.children && node.children.length > 0);
  const childrenReserveIconSpace = node.children?.some((child) => child.icon);
  const isExpanded = expanded.has(node.id);
  const active = activeId === node.id;
  const text = getNodeText(node) || node.id;
  const rowProps = {
    'data-tree-level': level,
    'data-tree-id': node.id,
    'data-tree-row': '',
    'data-tree-text': text,
    tabIndex: node.disabled ? -1 : node.id === tabbableId ? 0 : -1,
  };

  if (branch) {
    const trigger = (
      <button
        {...rowProps}
        aria-controls={contentId}
        aria-disabled={node.disabled || undefined}
        aria-expanded={compact ? false : isExpanded}
        className="one-tree__row one-tree__row--branch"
        disabled={node.disabled}
        onClick={() => {
          if (compact) {
            onCompactBranchClick?.();
            return;
          }

          if (!isExpanded) {
            setHasBeenOpened(true);
          }

          setExpanded(node.id, !isExpanded);
        }}
        type="button"
      >
        <RowContent branch node={node} reserveIconSpace={reserveIconSpace} />
      </button>
    );

    return (
      <li className="one-tree__item">
        <Collapsible.Root
          className="one-tree__branch"
          data-tree-stagger={hasBeenOpened ? 'true' : undefined}
          open={isExpanded}
        >
          <MaybeTooltip compact={compact} text={text}>
            {trigger}
          </MaybeTooltip>
          <Collapsible.Content
            className="one-tree__group-content"
            id={contentId}
          >
            <ul className="one-tree__group" hidden={compact || undefined}>
              {node.children?.map((child) => (
                <TreeItem
                  key={child.id}
                  level={level + 1}
                  node={child}
                  reserveIconSpace={childrenReserveIconSpace}
                />
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </li>
    );
  }

  const content = (
    <RowContent
      branch={false}
      node={node}
      reserveIconSpace={reserveIconSpace}
    />
  );

  if (node.href) {
    const row = (
      <a
        {...rowProps}
        aria-current={active ? 'page' : undefined}
        aria-disabled={node.disabled || undefined}
        className="one-tree__row"
        href={node.disabled ? undefined : node.href}
        onClick={(event) => {
          if (node.disabled) {
            event.preventDefault();
            return;
          }

          onNavigate?.(node);
        }}
      >
        {content}
      </a>
    );

    return (
      <li className="one-tree__item">
        <MaybeTooltip compact={compact} text={text}>
          {row}
        </MaybeTooltip>
      </li>
    );
  }

  if (onAction) {
    const row = (
      <button
        {...rowProps}
        aria-disabled={node.disabled || undefined}
        className="one-tree__row"
        disabled={node.disabled}
        onClick={() => onAction(node)}
        type="button"
      >
        {content}
      </button>
    );

    return (
      <li className="one-tree__item">
        <MaybeTooltip compact={compact} text={text}>
          {row}
        </MaybeTooltip>
      </li>
    );
  }

  return (
    <li className="one-tree__item">
      <div
        {...rowProps}
        aria-disabled="true"
        className="one-tree__row"
        tabIndex={-1}
      >
        {content}
      </div>
    </li>
  );
}
