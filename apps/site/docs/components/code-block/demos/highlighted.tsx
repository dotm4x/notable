'use client';

import { CodeBlock, useHighlightedCode } from '@dotm4x/one/components';

const code = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export default function Highlighted() {
  const lines = useHighlightedCode(code, 'tsx');

  return (
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.CopyButton value={code} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content>
        {lines.map((line, index) => (
          <CodeBlock.Line key={index}>{line}</CodeBlock.Line>
        ))}
      </CodeBlock.Content>
    </CodeBlock>
  );
}
