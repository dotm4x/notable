import type { ReactNode } from 'react';

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

export const toastControllerBrand: unique symbol = Symbol(
  'toastControllerBrand',
);

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

export interface ToastData {
  variant: ToastVariant;
  icon?: ReactNode | null;
  action?: ToastAction;
  className?: string;
  render?: (id: string) => ReactNode;
}
