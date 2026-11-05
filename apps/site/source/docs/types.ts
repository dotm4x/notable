export type DocStatus = 'draft' | 'stable' | 'beta';

export interface DocFrontmatter {
  title?: string;
  icon?: string;
  description?: string;
  order?: number;
  status?: DocStatus;
  sidebar?: boolean;
}

export interface DocEntry {
  /** Route segments below `/docs`. Empty for the docs root. */
  slug: string[];
  url: string;
  title: string;
  icon?: string;
  description?: string;
  order: number;
  sidebar: boolean;
  status: DocStatus;
  /** Absolute path to the page's `index.mdx`. */
  filePath: string;
  /** Absolute path to the page's folder. */
  directory: string;
  /** Folder path used to resolve the page's demos. */
  demoBase: string;
}

export interface DocPage extends DocEntry {
  content: string;
  frontmatter: DocFrontmatter;
}

export interface NavItem {
  title: string;
  icon?: string;
  url: string;
  description?: string;
  order: number;
  children: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface AdjacentDocs {
  previous?: NavItem;
  next?: NavItem;
}
