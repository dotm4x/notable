'use client';

import { ControlGroup, Input, Select } from '@dotm4x/one/components';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { iconCatalog, iconCategories } from '../../docs/icon-catalog';

/** Searchable catalog that links to every icon's detail page. */
export function DocsIconGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return iconCatalog.filter((icon) => {
      if (category !== 'all' && !icon.categories.includes(category)) {
        return false;
      }

      return search.length === 0 || icon.searchText.includes(search);
    });
  }, [category, query]);

  return (
    <div className="docs-icon-gallery">
      <div className="docs-icon-gallery__toolbar">
        <ControlGroup className="docs-icon-gallery__controls">
          <Input
            aria-label="Search icons"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons…"
            type="search"
            value={query}
          />
          <Select.Root
            onValueChange={(value) => setCategory(value ?? 'all')}
            value={category}
          >
            <Select.Trigger aria-label="Filter icons by category">
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                {iconCategories.map((item) => (
                  <Select.Item key={item} value={item}>
                    {item === 'all' ? 'All categories' : item}
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Content>
          </Select.Root>
        </ControlGroup>
        <p
          className="docs-icon-gallery__count"
          role="status"
          aria-live="polite"
        >
          {filtered.length} of {iconCatalog.length} icons
        </p>
      </div>
      {filtered.length > 0 ? (
        <ul className="docs-icon-grid">
          {filtered.map(({ name, Component, description }) => (
            <li key={name}>
              <Link
                className="docs-icon-tile"
                href={`/docs/icons/${name}`}
                title={description || undefined}
              >
                <Component size={20} />
                <span className="docs-icon-tile__label">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="docs-icon-gallery__count">
          No icons match the current search.
        </p>
      )}
    </div>
  );
}
