'use client';

import { CodeBlock, Tabs } from '@dotm4x/one/components';

export default function WithTabs() {
  return (
    <Tabs defaultValue="route">
      <Tabs.List aria-label="Files">
        <Tabs.Trigger value="route">route.ts</Tabs.Trigger>
        <Tabs.Trigger value="chat">chat.tsx</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="route">
        <CodeBlock>
          <CodeBlock.Header>
            <CodeBlock.Title>app/api/chat/route.ts</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            {
              'export async function POST() {\n  return Response.json({ ok: true });\n}'
            }
          </CodeBlock.Content>
        </CodeBlock>
      </Tabs.Content>
      <Tabs.Content value="chat">
        <CodeBlock>
          <CodeBlock.Header>
            <CodeBlock.Title>components/chat.tsx</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            {'export function Chat() {\n  return null;\n}'}
          </CodeBlock.Content>
        </CodeBlock>
      </Tabs.Content>
    </Tabs>
  );
}
