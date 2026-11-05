'use client';

import { Breadcrumb } from '@dotm4x/one/components';

export default function Separator() {
  return (
    <Breadcrumb separator="/">
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Docs</Breadcrumb.Item>
      <Breadcrumb.Item current>Components</Breadcrumb.Item>
    </Breadcrumb>
  );
}
