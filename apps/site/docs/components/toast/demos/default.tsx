'use client';

import { Button, ToastProvider, toast } from '@dotm4x/one/components';

export default function Default() {
  return (
    <ToastProvider>
      <Button onClick={() => toast.success('Changes saved.')}>
        Save changes
      </Button>
    </ToastProvider>
  );
}
