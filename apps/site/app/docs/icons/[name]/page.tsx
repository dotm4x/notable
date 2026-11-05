import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { iconMetadata, iconMetadataByName } from '@dotm4x/one/icons';
import {
  DocsBreadcrumbs,
  DocsIconDetail,
} from '../../../../source/components/docs';

interface PageProps {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return iconMetadata.map(({ name }) => ({ name }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name } = await params;
  const icon = iconMetadataByName[name];

  if (!icon) {
    return {};
  }

  return {
    title: `${icon.component} icon`,
    description: icon.description,
  };
}

export default async function IconPage({ params }: PageProps) {
  const { name } = await params;
  const icon = iconMetadataByName[name];

  if (!icon) {
    notFound();
  }

  return (
    <main className="docs-main">
      <article className="docs-article">
        <DocsBreadcrumbs
          items={[
            { label: 'Docs', href: '/docs' },
            { label: 'Icons', href: '/docs/icons' },
            { label: icon.component, href: `/docs/icons/${icon.name}` },
          ]}
        />
        <DocsIconDetail name={name} />
      </article>
    </main>
  );
}
