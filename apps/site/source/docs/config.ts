import path from 'node:path';

/** Absolute directory containing the documentation content. */
export const DOCS_DIR = path.join(process.cwd(), 'docs');

/** URL prefix for every documentation page. */
export const DOCS_BASE_PATH = '/docs';

/** File name that represents a page inside its folder. */
export const DOCS_PAGE_FILE = 'index.mdx';

/** Folders that are assets or demo code, not pages. */
export const DOCS_IGNORED_DIRS = new Set(['demos', 'assets']);
