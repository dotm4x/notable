'use client';

import { CodeBlock } from '@dotm4x/one/components';

export default function LineNumbers() {
  return (
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content lineNumbers startLine={12}>
        {
          'export function greet(name: string) {\n  return `Hello, ${name}!`;\n}'
        }
      </CodeBlock.Content>
    </CodeBlock>
  );
}
