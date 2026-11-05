'use client';

import { Button, Form, Input } from '@dotm4x/one/components';
import { useState, type FormEvent } from 'react';

export default function Submit() {
  const [saved, setSaved] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved(`${data.get('name')} (${data.get('email')})`);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input label="Full name" name="name" required />
      <Input label="Email address" name="email" type="email" required />
      <Button type="submit">Save changes</Button>
      {saved ? <p>Saved {saved}.</p> : null}
    </Form>
  );
}
