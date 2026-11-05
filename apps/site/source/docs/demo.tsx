import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { DOCS_DIR } from './config';
import { DemoFrame, type DemoLayout } from './demo-frame';
import { demoModules } from './generated/demos';

export interface DemoProps {
  /** Demo export name from the page's `demos/index.ts`. */
  name: string;
  /** Folder path of the page, supplied by the MDX renderer. */
  demoBase: string;
  layout?: DemoLayout;
}

function sourceFileName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Resolves a demo by name, renders it, and shows its source. It knows nothing
 * about the components inside the demo.
 */
export async function Demo({ name, demoBase, layout = 'center' }: DemoProps) {
  const group = demoModules[demoBase];
  const Component = group?.[name];

  if (!Component) {
    throw new Error(
      `Unknown demo "${name}" for "${demoBase || 'docs'}". Add it to ${path.join(
        demoBase,
        'demos',
        'index.ts',
      )}.`,
    );
  }

  const sourcePath = path.join(
    DOCS_DIR,
    demoBase,
    'demos',
    `${sourceFileName(name)}.tsx`,
  );
  const code = (await fs.readFile(sourcePath, 'utf8')).trim();

  return (
    <DemoFrame code={code} layout={layout}>
      <Component />
    </DemoFrame>
  );
}
