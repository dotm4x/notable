'use client';

import { Breadcrumb } from '@dotm4x/one/components';

export default function Collapsed() {
  return (
    <Breadcrumb maxVisibleItems={4}>
      <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
      <Breadcrumb.Item href="#">One</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Packages</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
      <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  );
}
