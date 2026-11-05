'use client';

import { Button, ToastProvider, toast } from '@dotm4x/one/components';

export default function Action() {
  return (
    <ToastProvider>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Message archived',
            description: 'The conversation was moved out of your inbox.',
            action: {
              label: 'Undo',
              onClick: () => toast.info('Message restored to your inbox.'),
            },
          })
        }
      >
        Archive message
      </Button>
    </ToastProvider>
  );
}
