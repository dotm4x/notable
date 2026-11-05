import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export interface TocItem {
  id: string;
  label: string;
  depth: number;
  children: TocItem[];
}

/**
 * Extracts second and third level headings from MDX. Heading ids match the
 * ids added by `rehype-slug` because both use GitHub's slugger.
 */
export function extractToc(source: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let currentSection: TocItem | undefined;

  visit(tree, 'heading', (node) => {
    if (node.depth < 2 || node.depth > 3) {
      return;
    }

    const label = toString(node).trim();

    if (!label) {
      return;
    }

    const item: TocItem = {
      id: slugger.slug(label),
      label,
      depth: node.depth,
      children: [],
    };

    if (node.depth === 2) {
      items.push(item);
      currentSection = item;
      return;
    }

    if (currentSection) {
      currentSection.children.push(item);
    } else {
      items.push(item);
    }
  });

  return items;
}
