import { notFound } from 'next/navigation';
import { DocsBreadcrumbs, DocsPager, DocsToc } from '../components/docs';
import {
  findNavNode,
  getAdjacentDocs,
  getBreadcrumbs,
  getDoc,
  getNavTree,
} from './content';
import { DocContent } from './mdx';
import { extractToc } from './toc';

export interface DocsPageProps {
  slug: string[];
}

/** Renders a documentation page from its MDX source. */
export async function DocsPage({ slug }: DocsPageProps) {
  const doc = getDoc(slug);

  if (!doc) {
    notFound();
  }

  const tree = getNavTree();
  const navNode = findNavNode(tree, slug);
  const toc = extractToc(doc.content);
  const breadcrumbs = getBreadcrumbs(slug);
  const { previous, next } = getAdjacentDocs(slug);

  return (
    <main className="docs-main">
      <article className="docs-article">
        <DocsBreadcrumbs items={breadcrumbs} />
        <header className="docs-article__header">
          <h1>{doc.title}</h1>
          {doc.description ? <p>{doc.description}</p> : null}
        </header>
        <div className="docs-content">
          <div className="docs-prose">
            <DocContent doc={doc} navNode={navNode} />
          </div>
          {toc.length > 0 ? (
            <aside className="docs-toc">
              <DocsToc items={toc} />
            </aside>
          ) : null}
        </div>
        <DocsPager next={next} previous={previous} />
      </article>
    </main>
  );
}
