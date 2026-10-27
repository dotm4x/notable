import { type ComponentProps, forwardRef } from 'react';
import './form.css';

export type TFormProps = Omit<ComponentProps<'form'>, 'className'> & {
  className?: string;
};

/**
 * Native `form` element. Validation, submission, and reset use the browser's
 * default behavior; events are not intercepted, so consumers handle `onSubmit`
 * and call `preventDefault` when they need to.
 */
export const Form = forwardRef<HTMLFormElement, TFormProps>(function Form(
  { className, ...props },
  ref,
) {
  return (
    <form
      {...props}
      ref={ref}
      className={joinClassNames('notable-form', className)}
    />
  );
});

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}
