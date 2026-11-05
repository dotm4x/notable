import * as OneIcons from '@dotm4x/one/icons';
import type { ComponentType } from 'react';

export type TIconComponent = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number | string;
}> & { iconNode: OneIcons.TIconNode };

/** A catalog entry combining public icon metadata with its component. */
export interface TIconCatalogEntry {
  name: string;
  component: string;
  Component: TIconComponent;
  /** Human-written description, or an empty string for placeholder copy. */
  description: string;
  keywords: string[];
  categories: string[];
  aliases: string[];
  tags: string[];
  useCases: string[];
  searchText: string;
}

const iconComponents = OneIcons as unknown as Record<
  string,
  TIconComponent | undefined
>;

/**
 * Placeholder metadata repeats the icon name, as in `"activity icon."`. It
 * adds noise wherever a real description belongs, so it resolves to nothing.
 */
function describeIcon(icon: { component: string; description: string }) {
  const description = icon.description.trim();

  return description.toLowerCase() === `${icon.component} icon.`.toLowerCase()
    ? ''
    : description;
}

/** Every published icon, sorted by its kebab-case name. */
export const iconCatalog: TIconCatalogEntry[] = OneIcons.iconMetadata.flatMap(
  (icon) => {
    const Component = iconComponents[icon.component];

    if (!Component) {
      return [];
    }

    return [
      {
        name: icon.name,
        component: icon.component,
        Component,
        description: describeIcon(icon),
        keywords: icon.keywords,
        categories: icon.categories,
        aliases: icon.aliases,
        tags: icon.tags,
        useCases: icon.useCases,
        searchText: [
          icon.name,
          icon.component,
          icon.description,
          ...icon.categories,
          ...icon.keywords,
          ...icon.tags,
          ...icon.aliases,
        ]
          .join(' ')
          .toLowerCase(),
      },
    ];
  },
);

export const iconCatalogByName = new Map(
  iconCatalog.map((entry) => [entry.name, entry]),
);

/** Category filters for the catalog, in alphabetical order. */
export const iconCategories = [
  'all',
  ...Array.from(
    new Set(iconCatalog.flatMap((entry) => entry.categories)),
  ).sort(),
];

const attributeNames: Record<string, string> = { className: 'class' };

function toAttributeName(name: string) {
  return (
    attributeNames[name] ??
    name.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
  );
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Serializes an icon into a standalone SVG document. */
export function toSvgMarkup(entry: TIconCatalogEntry) {
  const shapes = entry.Component.iconNode.map(([tag, attributes]) => {
    const rendered = Object.entries(attributes)
      .map(
        ([key, value]) =>
          ` ${toAttributeName(key)}="${escapeAttribute(String(value))}"`,
      )
      .join('');
    return `  <${tag}${rendered} />`;
  });

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    ...shapes,
    '</svg>',
  ].join('\n');
}

/** The import statement that brings one icon into a project. */
export function toImportStatement(entry: TIconCatalogEntry) {
  return `import { ${entry.component} } from '@dotm4x/one/icons';`;
}

/** The JSX element for one icon. */
export function toJsxUsage(entry: TIconCatalogEntry) {
  return `<${entry.component} aria-hidden="true" />`;
}

/** A copyable snippet showing the import and the element together. */
export function toJsxSnippet(entry: TIconCatalogEntry) {
  return `${toImportStatement(entry)}\n\n${toJsxUsage(entry)}`;
}

const categoryUsage = new Map<string, number>();
for (const entry of iconCatalog) {
  for (const category of entry.categories) {
    categoryUsage.set(category, (categoryUsage.get(category) ?? 0) + 1);
  }
}

/**
 * Broad categories, such as the `ui` catch-all, cover most of the set and say
 * little about which icons belong together.
 */
const maxDiscriminatingUsage = Math.max(1, iconCatalog.length * 0.1);

function isDiscriminating(category: string) {
  return (categoryUsage.get(category) ?? 0) <= maxDiscriminatingUsage;
}

/**
 * Ranks icons sharing specific categories, keywords, tags, or aliases with the
 * given icon. Category matches weigh more because they describe broader intent.
 */
export function getRelatedIcons(
  entry: TIconCatalogEntry,
  limit = 8,
): TIconCatalogEntry[] {
  const categories = new Set(entry.categories.filter(isDiscriminating));
  const terms = new Set(
    [...entry.keywords, ...entry.tags, ...entry.aliases].map((term) =>
      term.toLowerCase(),
    ),
  );

  return iconCatalog
    .filter((candidate) => candidate.name !== entry.name)
    .map((candidate) => {
      const categoryScore = candidate.categories.filter((category) =>
        categories.has(category),
      ).length;
      const termScore = [
        ...candidate.keywords,
        ...candidate.tags,
        ...candidate.aliases,
      ].filter((term) => terms.has(term.toLowerCase())).length;

      return { candidate, score: categoryScore * 2 + termScore };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.candidate.name.localeCompare(second.candidate.name),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
