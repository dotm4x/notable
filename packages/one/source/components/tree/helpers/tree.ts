import type { TreeNode } from '../types.js';

/** Returns the labels that lead to the active node, from the root down. */
export function getAncestorIds(items: TreeNode[], activeId: string): string[] {
  function walk(nodes: TreeNode[], ancestors: string[]): string[] | null {
    for (const node of nodes) {
      if (node.id === activeId) {
        return ancestors;
      }

      if (node.children && node.children.length > 0) {
        const found = walk(node.children, [...ancestors, node.id]);

        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  return walk(items, []) ?? [];
}

/** Returns the first node id in document order. */
export function findFirstId(items: TreeNode[]): string | undefined {
  return items[0]?.id;
}

/** Returns the plain text used for typeahead and tooltips. */
export function getNodeText(node: TreeNode): string {
  if (node.textValue) {
    return node.textValue;
  }

  if (typeof node.label === 'string') {
    return node.label;
  }

  return node.id;
}
