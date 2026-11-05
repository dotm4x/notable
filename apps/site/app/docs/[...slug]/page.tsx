import type { Metadata } from 'next';
import { DocsPage } from '../../../source/docs/page';
import { getAllDocSlugs, getDoc } from '../../../source/docs/content';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllDocSlugs()
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <DocsPage slug={slug} />;
}
