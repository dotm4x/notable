import { useMemo, useState } from 'react';
import * as IconModule from '@one/icons';
import { Button } from './components/button/button.js';
import { Input } from './components/input/input.js';
import { Select } from './components/select/select.js';
import type { Meta, StoryObj } from '@storybook/react-vite';

type TIconEntry = {
  name: string;
  Component: (props: Record<string, unknown>) => React.ReactNode;
  category: string;
};

const metadataModules = (import.meta as any).glob('../../icons/source/icons/svg/*/icon.json', {
  eager: true,
}) as Record<string, { default?: { categories?: string[] } } & { categories?: string[] }>;

const categoryByName = new Map<string, string>();
for (const [path, mod] of Object.entries(metadataModules)) {
  const match = path.match(/svg\/([^/]+)\/icon\.json$/);
  if (!match) continue;
  const name = match[1];
  const data = (mod as { default?: { categories?: string[] } }).default ?? (mod as { categories?: string[] });
  const category = data?.categories?.[0] ?? 'ui';
  categoryByName.set(name, category);
}

const iconEntries: TIconEntry[] = Object.entries(IconModule)
  .filter(([name, value]) => {
    if (name === 'Icon' || name === 'createIcon') return false;
    if (!value || typeof value !== 'object') return false;
    return true;
  })
  .map(([name, Component]) => ({
    name,
    Component: Component as TIconEntry['Component'],
    category: categoryByName.get(name.replace(/([A-Z])/g, (m, c, i) => (i ? '-' : '') + c.toLowerCase()).replace(/^-/, '')) ?? 'ui',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function IconsPreviewer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(iconEntries.map((e) => e.category))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return iconEntries.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (!q) return true;
      return entry.name.toLowerCase().includes(q) || entry.category.toLowerCase().includes(q);
    });
  }, [query, category]);

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          type="search"
          aria-label="Search icons"
          placeholder="Search icons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <Select.Root value={category} onValueChange={(v) => setCategory(v ?? 'all')}>
          <Select.Trigger aria-label="Category" style={{ minWidth: 160 }}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              {categories.map((c) => (
                <Select.Item key={c} value={c}>
                  {c}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Select.Root>
        <span style={{ alignSelf: 'center', fontSize: 12, color: '#666' }}>
          {filtered.length} / {iconEntries.length}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
          gap: 8,
        }}
      >
        {filtered.map(({ name, Component, category: cat }) => (
          <Button
            key={name}
            variant="ghost"
            size="small"
            onClick={() => handleCopy(name)}
            title={`${name} (${cat})`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              height: 'auto',
              padding: 8,
              background: copied === name ? 'var(--one-surface-raised, #f0f9ff)' : undefined,
            }}
          >
            <Component size={20} />
            <span style={{ fontSize: 10, wordBreak: 'break-all', textAlign: 'center' }}>{name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Icons/Previewer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <IconsPreviewer />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimal icon previewer with search and category filtering.',
      },
    },
  },
};
