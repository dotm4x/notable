import { Toast as BaseToast } from '@base-ui/react/toast';
import { Bell, Check, Info, TriangleAlert, X, XCircle } from '../../../icons';
import type { ToastData } from '../types.js';

export function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return toasts.map((notification) => {
    const data = notification.data;
    const variant = data?.variant ?? 'default';
    const icon =
      data?.icon === null
        ? null
        : (data?.icon ??
          (variant === 'success' ? (
            <Check aria-hidden="true" />
          ) : variant === 'error' ? (
            <XCircle aria-hidden="true" />
          ) : variant === 'warning' ? (
            <TriangleAlert aria-hidden="true" />
          ) : variant === 'info' ? (
            <Info aria-hidden="true" />
          ) : (
            <Bell aria-hidden="true" />
          )));
    const className = ['one-toast', `one-toast--${variant}`, data?.className]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseToast.Root
        key={notification.id}
        toast={notification}
        className={className}
      >
        <BaseToast.Content className="one-toast__content">
          {data?.render ? (
            <div className="one-toast__custom">
              {data.render(notification.id)}
              <BaseToast.Close
                className="one-toast__close"
                aria-label="Dismiss notification"
              >
                <X aria-hidden="true" />
              </BaseToast.Close>
            </div>
          ) : (
            <>
              {icon && (
                <span className="one-toast__icon" aria-hidden="true">
                  {icon}
                </span>
              )}
              <div className="one-toast__body">
                {notification.title && (
                  <BaseToast.Title className="one-toast__title">
                    {notification.title}
                  </BaseToast.Title>
                )}
                {notification.description && (
                  <BaseToast.Description className="one-toast__description">
                    {notification.description}
                  </BaseToast.Description>
                )}
                {data?.action && (
                  <BaseToast.Action className="one-toast__action">
                    {data.action.label}
                  </BaseToast.Action>
                )}
              </div>
              <BaseToast.Close
                className="one-toast__close"
                aria-label="Dismiss notification"
              >
                <X aria-hidden="true" />
              </BaseToast.Close>
            </>
          )}
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}
