'use client';

import {
  Badge,
  CopyButton,
  Disclosure,
  SegmentedControl,
  type SegmentedControlOption,
} from '@dotm4x/one/components';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  getRelatedIcons,
  iconCatalogByName,
  toImportStatement,
  toJsxSnippet,
  toJsxUsage,
  toSvgMarkup,
} from '../../docs/icon-catalog';
import { DocsCodeBlock } from './docs-code-block';

const colors = {
  default: 'var(--one-color-text)',
  muted: 'var(--one-color-text-muted)',
  success: 'var(--one-color-success)',
  danger: 'var(--one-color-danger)',
} as const;

type TColor = keyof typeof colors;

const sizes = ['16', '24', '32', '48'] as const;
const strokes = ['1.5', '2', '2.5'] as const;

type TSize = (typeof sizes)[number];
type TStroke = (typeof strokes)[number];

const sizeOptions = sizes.map(
  (size) => ({ label: size, value: size }) as const,
) satisfies readonly SegmentedControlOption<TSize>[];

const strokeOptions = strokes.map(
  (stroke) => ({ label: stroke, value: stroke }) as const,
) satisfies readonly SegmentedControlOption<TStroke>[];

const colorNames: Record<TColor, string> = {
  default: 'Default color',
  muted: 'Muted color',
  success: 'Success color',
  danger: 'Danger color',
};

const colorOptions = (Object.keys(colors) as TColor[]).map(
  (color) =>
    ({
      'aria-label': colorNames[color],
      label: (
        <span
          className="docs-icon-detail__swatch"
          style={{ backgroundColor: colors[color] }}
        />
      ),
      value: color,
    }) as const,
) satisfies readonly SegmentedControlOption<TColor>[];

export interface DocsIconDetailProps {
  /** Kebab-case icon name from the route. */
  name: string;
}

/** Interactive preview, copy actions, and metadata for one icon. */
export function DocsIconDetail({ name }: DocsIconDetailProps) {
  const entry = iconCatalogByName.get(name);
  const [size, setSize] = useState<TSize>('24');
  const [stroke, setStroke] = useState<TStroke>('2');
  const [color, setColor] = useState<TColor>('default');

  const terms = useMemo(() => {
    if (!entry) {
      return [];
    }

    const ignored = new Set([
      entry.name.toLowerCase(),
      entry.component.toLowerCase(),
    ]);

    return Array.from(
      new Set(
        [...entry.keywords, ...entry.tags, ...entry.aliases].filter(
          (term) => !ignored.has(term.toLowerCase()),
        ),
      ),
    );
  }, [entry]);

  const related = useMemo(() => (entry ? getRelatedIcons(entry) : []), [entry]);

  if (!entry) {
    return null;
  }

  const { Component } = entry;

  return (
    <div className="docs-icon-detail">
      <header className="docs-article__header">
        <h1>{entry.component}</h1>
        <p className="docs-icon-detail__slug">{entry.name}</p>
        {entry.description ? <p>{entry.description}</p> : null}
      </header>

      <div
        className="docs-icon-detail__preview"
        style={{ color: colors[color] }}
      >
        <Component
          aria-hidden="true"
          size={Number(size)}
          strokeWidth={Number(stroke)}
        />
      </div>

      <div className="docs-icon-detail__controls">
        <SegmentedControl
          label="Size"
          onChange={setSize}
          options={sizeOptions}
          size="small"
          value={size}
        />
        <SegmentedControl
          label="Stroke"
          onChange={setStroke}
          options={strokeOptions}
          size="small"
          value={stroke}
        />
        <SegmentedControl
          label="Color"
          onChange={setColor}
          options={colorOptions}
          size="small"
          value={color}
        />
      </div>

      <div className="docs-icon-detail__actions">
        <CopyButton label="Copy SVG" value={toSvgMarkup(entry)} />
        <CopyButton label="Copy JSX" value={toJsxUsage(entry)} />
        <CopyButton label="Copy import" value={toImportStatement(entry)} />
      </div>

      <section aria-labelledby="docs-icon-usage">
        <h2 id="docs-icon-usage">Usage</h2>
        <DocsCodeBlock code={toJsxSnippet(entry)} language="tsx" />
        <Disclosure className="docs-icon-detail__markup" title="SVG markup">
          <DocsCodeBlock code={toSvgMarkup(entry)} language="xml" />
        </Disclosure>
      </section>

      <section aria-labelledby="docs-icon-metadata">
        <h2 id="docs-icon-metadata">Metadata</h2>
        <dl className="docs-icon-detail__meta">
          <div>
            <dt>Categories</dt>
            <dd>
              {entry.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </dd>
          </div>
          {terms.length > 0 ? (
            <div>
              <dt>Keywords</dt>
              <dd>
                {terms.map((term) => (
                  <Badge key={term} variant="outline">
                    {term}
                  </Badge>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="docs-icon-related">
          <h2 id="docs-icon-related">More like this</h2>
          <ul className="docs-icon-grid">
            {related.map((item) => (
              <li key={item.name}>
                <Link
                  className="docs-icon-tile"
                  href={`/docs/icons/${item.name}`}
                  title={item.description}
                >
                  <item.Component size={20} />
                  <span className="docs-icon-tile__label">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
