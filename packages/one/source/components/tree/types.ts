import type { HTMLAttributes, ReactNode } from 'react';

/** A node in a navigation tree. */
export interface TreeNode {
  /** Unique, stable identifier used for state and keyboard focus. */
  id: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional destination. Leaves with an href render as native links. */
  href?: string;
  /** Optional icon displayed before the label. */
  icon?: ReactNode;
  /** Nested destinations. Presence makes the node a disclosure branch. */
  children?: TreeNode[];
  /** Prevents interaction with the node. */
  disabled?: boolean;
  /** Plain text used for typeahead when the label is not a string. */
  textValue?: string;
}

export type TTreeProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
  /** Top-level nodes. */
  items: TreeNode[];
  /** Current destination, matched against `TreeNode.id`. */
  activeId?: string;
  /** Expanded node ids in controlled mode. */
  expandedIds?: string[];
  /** Initial expanded node ids in uncontrolled mode. */
  defaultExpandedIds?: string[];
  /** Called whenever a branch is expanded or collapsed. */
  onExpandedChange?: (ids: string[]) => void;
  /**
   * Expands the ancestors of `activeId`. Defaults to `true`.
   */
  autoExpandActive?: boolean;
  /**
   * Enables tooltips for icon-only presentation. `Sidebar.Tree` sets it from
   * the sidebar's collapsed state.
   */
  compact?: boolean;
  /** Called when a link destination is activated. */
  onNavigate?: (node: TreeNode) => void;
  /** Called when a branch is clicked in compact mode. */
  onCompactBranchClick?: () => void;
  /** Called when an action leaf without an href is activated. */
  onAction?: (node: TreeNode) => void;
};
