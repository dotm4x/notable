'use client';

import { CodeBlock } from '@dotm4x/one/components';

export default function Diff() {
  return (
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Line>
          export function greet(name: string) {'{'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="removed">
          {'  return `Hello, ${name}`;'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="added">
          {'  return `Hello, ${name}!`;'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="highlighted">{'}'}</CodeBlock.Line>
      </CodeBlock.Content>
    </CodeBlock>
  );
}
