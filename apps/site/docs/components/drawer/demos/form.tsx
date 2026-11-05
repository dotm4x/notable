'use client';

import { Button, Drawer, Input } from '@dotm4x/one/components';
import { useId, useState } from 'react';

export default function Form() {
  const formId = useId();
  const [projectName, setProjectName] = useState('One');

  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Edit project</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit project</Drawer.Title>
          <Drawer.Description>
            Rename the project and update the owner contact.
          </Drawer.Description>
        </Drawer.Header>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
          }}
          style={{ display: 'grid', gap: '16px' }}
        >
          <Input
            label="Project name"
            name="projectName"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);
            }}
            required
          />
          <Input
            label="Owner email"
            name="ownerEmail"
            type="email"
            placeholder="you@example.com"
          />
        </form>
        <Drawer.Footer>
          <Drawer.Close>Cancel</Drawer.Close>
          <Button type="submit" form={formId} variant="primary">
            Save changes
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}
