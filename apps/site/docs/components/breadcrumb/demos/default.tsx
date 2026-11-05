'use client';

import { Breadcrumb } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Settings</Breadcrumb.Item>
      <Breadcrumb.Item current>Profile</Breadcrumb.Item>
    </Breadcrumb>
  );
}
