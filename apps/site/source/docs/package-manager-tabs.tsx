'use client';

import { CodeBlock, Tabs } from '@dotm4x/one/components';

export interface PackageManagerTabsProps {
  pnpm: string;
  npm: string;
  yarn: string;
  bun: string;
}

const managers = ['pnpm', 'npm', 'yarn', 'bun'] as const;

/** Shows one install command per package manager. */
export function PackageManagerTabs({
  pnpm,
  npm,
  yarn,
  bun,
}: PackageManagerTabsProps) {
  const commands = { pnpm, npm, yarn, bun };

  return (
    <Tabs className="docs-package-tabs" defaultValue="pnpm">
      <Tabs.List aria-label="Package manager">
        {managers.map((manager) => (
          <Tabs.Trigger key={manager} value={manager}>
            {manager}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {managers.map((manager) => (
        <Tabs.Content key={manager} value={manager}>
          <CodeBlock className="docs-package-tabs__block">
            <CodeBlock.Content>{commands[manager]}</CodeBlock.Content>
          </CodeBlock>
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
