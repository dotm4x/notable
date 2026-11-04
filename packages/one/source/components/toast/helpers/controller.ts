import type { ToastManager } from '@base-ui/react/toast';
import type {
  ToastApi,
  ToastData,
  ToastInput,
  ToastOptions,
  ToastVariant,
} from '../types.js';

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

export function makeToastApi(manager: ToastManager<ToastData>): ToastApi {
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
