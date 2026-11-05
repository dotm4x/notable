'use client';

import { CodeBlock, CopyButton, Tabs } from '@dotm4x/one/components';
import { useHighlightedCode } from '@dotm4x/one/code-block/highlighter';
import type { ReactNode } from 'react';

export type DemoLayout = 'center' | 'start';

interface DemoFrameProps {
  code: string;
  layout: DemoLayout;
  children: ReactNode;
}

/** The single preview frame shared by every demo. */
export function DemoFrame({ code, layout, children }: DemoFrameProps) {
  const lines = useHighlightedCode(code, 'tsx');

  return (
    <div className="docs-demo">
      <Tabs defaultValue="preview">
        <div className="docs-demo__toolbar">
          <Tabs.List aria-label="Demo view">
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
          </Tabs.List>
          <CopyButton value={code} />
        </div>
        <Tabs.Content
          className="docs-demo__preview"
          data-layout={layout}
          value="preview"
        >
          {children}
        </Tabs.Content>
        <Tabs.Content className="docs-demo__code" value="code">
          <CodeBlock className="docs-demo__code-block">
            <CodeBlock.Content>
              {lines.map((line, index) => (
                <CodeBlock.Line key={index}>{line}</CodeBlock.Line>
              ))}
            </CodeBlock.Content>
          </CodeBlock>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
