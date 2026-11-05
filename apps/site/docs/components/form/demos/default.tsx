'use client';

import { Button, Form, Input } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Form>
      <Input
        label="Email address"
        name="email"
        type="email"
        required
        description="We will only use this address to send the newsletter."
      />
      <Button type="submit">Subscribe</Button>
    </Form>
  );
}
