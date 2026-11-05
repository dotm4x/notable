import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import {
  DOCS_BASE_PATH,
  DOCS_DIR,
  DOCS_IGNORED_DIRS,
  DOCS_PAGE_FILE,
} from './config';
import type {
  AdjacentDocs,
  BreadcrumbItem,
  DocEntry,
  DocFrontmatter,
  DocPage,
  DocStatus,
  NavItem,
} from './types';

function humanize(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readFrontmatter(raw: string) {
  return matter(raw).data as DocFrontmatter;
}

function resolveStatus(value: DocFrontmatter['status']): DocStatus {
  return value === 'draft' || value === 'beta' ? value : 'stable';
}

function collectDocs(directory: string, segments: string[] = []): DocEntry[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const pages: DocEntry[] = [];
  const pagePath = path.join(directory, DOCS_PAGE_FILE);

  if (fs.existsSync(pagePath)) {
    const raw = fs.readFileSync(pagePath, 'utf8');
    const frontmatter = readFrontmatter(raw);
    const lastSegment = segments[segments.length - 1];

    pages.push({
      slug: segments,
      url: `${DOCS_BASE_PATH}${segments.length ? `/${segments.join('/')}` : ''}`,
      title:
        frontmatter.title ??
        (lastSegment ? humanize(lastSegment) : 'Introduction'),
      icon: frontmatter.icon,
      description: frontmatter.description,
      order:
        typeof frontmatter.order === 'number'
          ? frontmatter.order
          : Number.MAX_SAFE_INTEGER,
      sidebar: frontmatter.sidebar !== false,
      status: resolveStatus(frontmatter.status),
      filePath: pagePath,
      directory,
      demoBase: segments.join('/'),
    });
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (
      entry.name.startsWith('.') ||
      entry.name.startsWith('_') ||
      DOCS_IGNORED_DIRS.has(entry.name)
    ) {
      continue;
    }

    pages.push(
      ...collectDocs(path.join(directory, entry.name), [
        ...segments,
        entry.name,
      ]),
    );
  }

  return pages;
}

/**
 * Returns every published documentation page. The result is memoized for the
 * duration of a server request.
 */
export const getDocs = cache((): DocEntry[] => {
  const pages = collectDocs(DOCS_DIR);

  return pages
    .filter(
      (page) =>
        page.status !== 'draft' || process.env.NODE_ENV !== 'production',
    )
    .sort(compareEntries);
});

function compareEntries(first: DocEntry, second: DocEntry) {
  return (
    first.order - second.order || first.title.localeCompare(second.title, 'en')
  );
}

function compareNavItems(first: NavItem, second: NavItem) {
  return (
    first.order - second.order || first.title.localeCompare(second.title, 'en')
  );
}

function sortTree(item: NavItem) {
  item.children.sort(compareNavItems);
  item.children.forEach(sortTree);
}

/**
 * Builds the sidebar tree from the filesystem. Folder indexes become both a
 * page and a section, so a new section needs no navigation configuration.
 */
export const getNavTree = cache((): NavItem => {
  const pages = getDocs().filter((page) => page.sidebar);
  const rootPage = pages.find((page) => page.slug.length === 0);
  const root: NavItem = {
    title: rootPage?.title ?? 'Docs',
    icon: rootPage?.icon,
    url: DOCS_BASE_PATH,
    description: rootPage?.description,
    order: rootPage?.order ?? 0,
    children: [],
  };

  const nodes = new Map<string, NavItem>();
  nodes.set('', root);

  const ordered = [...pages].sort(
    (first, second) => first.slug.length - second.slug.length,
  );

  for (const page of ordered) {
    if (page.slug.length === 0) {
      continue;
    }

    const node: NavItem = {
      title: page.title,
      icon: page.icon,
      url: page.url,
      description: page.description,
      order: page.order,
      children: [],
    };
    nodes.set(page.slug.join('/'), node);

    const parentKey = page.slug.slice(0, -1).join('/');
    const parent = nodes.get(parentKey) ?? root;
    parent.children.push(node);
  }

  sortTree(root);
  return root;
});

export function findNavNode(
  tree: NavItem,
  slug: string[],
): NavItem | undefined {
  if (slug.length === 0) {
    return tree;
  }

  let current: NavItem | undefined = tree;

  for (const segment of slug) {
    current = current.children.find((child) =>
      child.url.endsWith(`/${segment}`),
    );

    if (!current) {
      return undefined;
    }
  }

  return current;
}

export function getDoc(slug: string[]): DocPage | undefined {
  const normalized = slug.filter(Boolean);

  if (
    normalized.some(
      (segment) =>
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\'),
    )
  ) {
    return undefined;
  }

  const entry = getDocs().find(
    (page) => page.slug.join('/') === normalized.join('/'),
  );

  if (!entry) {
    return undefined;
  }

  const raw = fs.readFileSync(entry.filePath, 'utf8');
  const parsed = matter(raw);

  return {
    ...entry,
    content: parsed.content,
    frontmatter: parsed.data as DocFrontmatter,
  };
}

export function getAllDocSlugs(): string[][] {
  return getDocs().map((page) => page.slug);
}

function flattenNav(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...flattenNav(item.children)]);
}

export function getAdjacentDocs(slug: string[]): AdjacentDocs {
  const tree = getNavTree();
  const items = flattenNav(tree.children);
  const index = items.findIndex(
    (item) => item.url === `${DOCS_BASE_PATH}/${slug.join('/')}`,
  );

  if (slug.length === 0) {
    return { next: items[0] };
  }

  if (index === -1) {
    return {};
  }

  return {
    previous: items[index - 1],
    next: items[index + 1],
  };
}

export function getBreadcrumbs(slug: string[]): BreadcrumbItem[] {
  const tree = getNavTree();
  const items: BreadcrumbItem[] = [{ label: 'Docs', href: DOCS_BASE_PATH }];
  let current = tree;

  for (let index = 0; index < slug.length; index += 1) {
    const next = current.children.find(
      (child) =>
        child.url === `${DOCS_BASE_PATH}/${slug.slice(0, index + 1).join('/')}`,
    );

    if (!next) {
      break;
    }

    items.push({ label: next.title, href: next.url });
    current = next;
  }

  return items;
}
