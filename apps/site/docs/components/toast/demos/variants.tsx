'use client';

import { Button, ToastProvider, toast } from '@dotm4x/one/components';

export default function Variants() {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button onClick={() => toast('Draft saved locally.')}>Default</Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Workspace created.')}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('The invitation could not be sent.')}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Your session expires in 5 minutes.')}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info('A new version is available.')}
        >
          Info
        </Button>
      </div>
    </ToastProvider>
  );
}
