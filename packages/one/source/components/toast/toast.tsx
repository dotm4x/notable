import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ToastManager } from '@base-ui/react/toast';
import { makeToastApi } from './helpers/controller.js';
import { ToastList } from './parts/list.js';
import { toastControllerBrand } from './types.js';
import type {
  ToastController,
  ToastData,
  ToastProviderProps,
} from './types.js';
import './toast.css';

export type {
  ToastAction,
  ToastApi,
  ToastController,
  ToastInput,
  ToastOptions,
  ToastPosition,
  ToastPromiseMessage,
  ToastPromiseMessages,
  ToastProviderProps,
  ToastVariant,
} from './types.js';

const managers = new WeakMap<ToastController, ToastManager<ToastData>>();

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
          className={`one-toast__viewport one-toast__viewport--${position}`}
          aria-label={`Notifications ${position.replace(/-/g, ' ')}`}
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
