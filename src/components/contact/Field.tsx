import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Form controls with a visible label (never placeholder-only), an error that
 * sits directly under the field it belongs to, and a focus state you cannot
 * miss.
 */

const control = cn(
  'w-full rounded-xl border bg-surface-2/70 px-4 text-[0.9375rem] text-ink',
  'placeholder:text-ink-3',
  'transition-[border-color,box-shadow,background-color] duration-200',
  // Full-strength azure: the border IS the focus indicator here, and at /60
  // it measured 2.85:1 against the field, under WCAG's 3:1 for focus.
  'focus:outline-none focus:border-azure focus:bg-surface-2',
  'focus:shadow-[0_0_0_3px_rgb(77_141_255/0.15)]',
);

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-2">
      <span className="mono-label text-ink-3">{children}</span>
      {optional && (
        <span className="font-mono text-[0.625rem] lowercase tracking-normal text-ink-3">
          optional
        </span>
      )}
    </label>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.8125rem] text-rose-300">
      {message}
    </p>
  );
}

type BaseProps = {
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
};

export const TextField = forwardRef<
  HTMLInputElement,
  BaseProps & React.ComponentPropsWithoutRef<'input'>
>(function TextField({ label, error, optional, className, ...rest }, ref) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          'h-12',
          error ? 'border-rose-400/50' : 'border-hairline-strong',
        )}
        {...rest}
      />
      <ErrorText id={errorId} message={error} />
    </div>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & React.ComponentPropsWithoutRef<'textarea'>
>(function TextAreaField({ label, error, optional, className, ...rest }, ref) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          'min-h-[8.5rem] resize-y py-3.5 leading-relaxed',
          error ? 'border-rose-400/50' : 'border-hairline-strong',
        )}
        {...rest}
      />
      <ErrorText id={errorId} message={error} />
    </div>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & { options: readonly string[]; placeholder: string } & React.ComponentPropsWithoutRef<'select'>
>(function SelectField(
  { label, error, optional, options, placeholder, className, ...rest },
  ref,
) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            control,
            'h-12 cursor-pointer appearance-none pr-11',
            error ? 'border-rose-400/50' : 'border-hairline-strong',
            rest.value ? 'text-ink' : 'text-ink-3',
          )}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-surface-2 text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.75}
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-3"
        />
      </div>
      <ErrorText id={errorId} message={error} />
    </div>
  );
});
