'use client';

import { CodeBlock } from '@dotm4x/one/components';
import { useHighlightedCode } from '@dotm4x/one/code-block/highlighter';

export interface DocsCodeBlockProps {
  code: string;
  language?: string;
}

/** Renders MDX fenced code with the package CodeBlock and optional Shiki. */
export function DocsCodeBlock({ code, language = 'tsx' }: DocsCodeBlockProps) {
  const lines = useHighlightedCode(code, language);

  return (
    <CodeBlock>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton value={code} />
      </CodeBlock.Actions>
      <CodeBlock.Content>
        {lines.map((line, index) => (
          <CodeBlock.Line key={index}>{line}</CodeBlock.Line>
        ))}
      </CodeBlock.Content>
    </CodeBlock>
  );
}
