'use client';

import { Breadcrumb } from '@dotm4x/one/components';

export default function Dropdown() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Dropdown
        label="Projects"
        items={[
          { label: 'One', href: '#one' },
          { label: 'Website', href: '#website' },
          { label: 'Tooling', href: '#tooling' },
        ]}
      />
      <Breadcrumb.Item current>One</Breadcrumb.Item>
    </Breadcrumb>
  );
}
