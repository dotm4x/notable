'use client';

import { Collapsible } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Collapsible>
      <Collapsible.Trigger>
        What is included in the Pro plan?
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p>
          Pro includes unlimited projects, shared workspaces, and priority
          support for every member of your team.
        </p>
      </Collapsible.Content>
    </Collapsible>
  );
}
