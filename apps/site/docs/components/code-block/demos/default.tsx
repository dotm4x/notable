'use client';

import { CodeBlock } from '@dotm4x/one/components';

const code = `export async function GET() {
  return Response.json({ ok: true });
}`;

export default function Default() {
  return (
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Title>app/api/health/route.ts</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.CopyButton value={code} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content>{code}</CodeBlock.Content>
    </CodeBlock>
  );
}
