import type { Metadata } from 'next';
import { DocsPage } from '../../source/docs/page';
import { getDoc } from '../../source/docs/content';

export async function generateMetadata(): Promise<Metadata> {
  const doc = getDoc([]);

  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} · One`,
    description: doc.description,
  };
}

export default function Page() {
  return <DocsPage slug={[]} />;
}
