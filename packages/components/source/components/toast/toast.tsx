import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ToastManager } from '@base-ui/react/toast';
import { Bell, Check, Info, TriangleAlert, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import './toast.css';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  icon?: ReactNode | null;
  action?: ToastAction;
  id?: string;
  className?: string;
}

export type ToastInput = string | ToastOptions;

export type ToastPromiseMessage<TValue> =
  string | ToastOptions | ((value: TValue) => string | ToastOptions);

export interface ToastPromiseMessages<TValue> {
  loading: string | ToastOptions;
  success: ToastPromiseMessage<TValue>;
  error: string | ToastOptions | ((error: unknown) => string | ToastOptions);
}

export interface ToastApi {
  (message: ToastInput): string;
  success(message: ToastInput): string;
  error(message: ToastInput): string;
  warning(message: ToastInput): string;
  info(message: ToastInput): string;
  loading(message: ToastInput): string;
  custom(
    render: (id: string) => ReactNode,
    options?: Omit<ToastOptions, 'title' | 'description'>,
  ): string;
  promise<TValue>(
    promise: Promise<TValue>,
    messages: ToastPromiseMessages<TValue>,
  ): Promise<TValue>;
  update(id: string, options: Partial<ToastOptions>): void;
  dismiss(id?: string): void;
}

export interface ToastController {
  readonly toast: ToastApi;
  readonly [toastControllerBrand]: true;
}

export interface ToastProviderProps {
  children?: ReactNode;
  position?: ToastPosition;
  defaultDuration?: number;
  maxToasts?: number;
  controller?: ToastController;
}

interface ToastData {
  variant: ToastVariant;
  icon?: ReactNode | null;
  action?: ToastAction;
  className?: string;
  render?: (id: string) => ReactNode;
}

const toastControllerBrand: unique symbol = Symbol('toastControllerBrand');

const managers = new WeakMap<ToastController, ToastManager<ToastData>>();

function inputOptions(input: ToastInput, variant?: ToastVariant): ToastOptions {
  return typeof input === 'string'
    ? { description: input, variant }
    : { ...input, variant: variant ?? input.variant };
}

function toManagerOptions(
  options: ToastOptions,
  variant: ToastVariant = 'default',
) {
  const actualVariant = options.variant ?? variant;
  return {
    id: options.id,
    title: options.title,
    description: options.description,
    timeout: options.duration,
    type: actualVariant,
    data: {
      variant: actualVariant,
      icon: options.icon,
      action: options.action,
      className: options.className,
    },
    actionProps: options.action
      ? { onClick: options.action.onClick }
      : undefined,
  };
}

function promiseOptions(
  input: string | ToastOptions,
  variant: ToastVariant,
  loading = false,
) {
  const options = inputOptions(input, variant);
  return {
    ...toManagerOptions(options, variant),
    timeout: options.duration ?? (loading ? 0 : undefined),
  };
}

function makeToastApi(manager: ToastManager<ToastData>): ToastApi {
  const toast = ((input: ToastInput) =>
    manager.add(toManagerOptions(inputOptions(input)))) as ToastApi;

  toast.success = (input) =>
    manager.add(toManagerOptions(inputOptions(input, 'success')));
  toast.error = (input) =>
    manager.add(toManagerOptions(inputOptions(input, 'error')));
  toast.warning = (input) =>
    manager.add(toManagerOptions(inputOptions(input, 'warning')));
  toast.info = (input) =>
    manager.add(toManagerOptions(inputOptions(input, 'info')));
  toast.loading = (input) =>
    manager.add(
      toManagerOptions({ ...inputOptions(input, 'info'), duration: 0 }, 'info'),
    );
  toast.custom = (render, options = {}) =>
    manager.add({
      ...toManagerOptions(options),
      data: {
        variant: options.variant ?? 'default',
        icon: options.icon,
        action: options.action,
        className: options.className,
        render,
      },
    });
  toast.promise = (promise, messages) =>
    manager.promise(promise, {
      loading: promiseOptions(messages.loading, 'info', true),
      success: (value) => {
        const message =
          typeof messages.success === 'function'
            ? messages.success(value)
            : messages.success;
        return promiseOptions(message, 'success');
      },
      error: (error) => {
        const message =
          typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error;
        return promiseOptions(message, 'error');
      },
    });
  toast.update = (id, options) => {
    manager.update(id, (previous) => {
      const update = toManagerOptions(options);
      return {
        ...(options.title !== undefined && { title: update.title }),
        ...(options.description !== undefined && {
          description: update.description,
        }),
        ...(options.duration !== undefined && { timeout: update.timeout }),
        ...(options.variant !== undefined && { type: update.type }),
        ...(options.action !== undefined && {
          actionProps: update.actionProps,
        }),
        data: {
          ...previous.data,
          variant: options.variant ?? previous.data?.variant ?? 'default',
          ...(Object.hasOwn(options, 'icon') && { icon: options.icon }),
          ...(options.action !== undefined && { action: options.action }),
          ...(options.className !== undefined && {
            className: options.className,
          }),
        },
      };
    });
  };
  toast.dismiss = (id) => manager.close(id);

  return toast;
}

export function createToastController(): ToastController {
  const manager = BaseToast.createToastManager<ToastData>();
  const controller = {
    toast: makeToastApi(manager),
    [toastControllerBrand]: true as const,
  };
  managers.set(controller, manager);
  return controller;
}

const defaultController = createToastController();
export const toast = defaultController.toast;

function ToastList() {
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
    const className = [
      'notable-toast',
      `notable-toast--${variant}`,
      data?.className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseToast.Root
        key={notification.id}
        toast={notification}
        className={className}
      >
        <BaseToast.Content className="notable-toast__content">
          {data?.render ? (
            <div className="notable-toast__custom">
              {data.render(notification.id)}
              <BaseToast.Close
                className="notable-toast__close"
                aria-label="Dismiss notification"
              >
                <X aria-hidden="true" />
              </BaseToast.Close>
            </div>
          ) : (
            <>
              {icon && (
                <span className="notable-toast__icon" aria-hidden="true">
                  {icon}
                </span>
              )}
              <div className="notable-toast__body">
                {notification.title && (
                  <BaseToast.Title className="notable-toast__title">
                    {notification.title}
                  </BaseToast.Title>
                )}
                {notification.description && (
                  <BaseToast.Description className="notable-toast__description">
                    {notification.description}
                  </BaseToast.Description>
                )}
                {data?.action && (
                  <BaseToast.Action className="notable-toast__action">
                    {data.action.label}
                  </BaseToast.Action>
                )}
              </div>
              <BaseToast.Close
                className="notable-toast__close"
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

export function ToastProvider({
  children,
  position = 'bottom-right',
  defaultDuration = 5000,
  maxToasts = 5,
  controller = defaultController,
}: ToastProviderProps) {
  const manager = managers.get(controller);
  if (!manager) {
    throw new Error(
      'ToastProvider controller must be created with createToastController().',
    );
  }

  return (
    <BaseToast.Provider
      toastManager={manager}
      timeout={defaultDuration}
      limit={maxToasts}
    >
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className={`notable-toast-viewport notable-toast-viewport--${position}`}
          aria-label={`Notifications ${position.replace(/-/g, ' ')}`}
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
