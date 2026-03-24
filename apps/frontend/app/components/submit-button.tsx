'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: ReactNode;
  pendingText?: string;
};

export function SubmitButton({
  children,
  className,
  disabled,
  pendingText = 'Saving...',
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      {...props}
      type="submit"
      aria-busy={pending}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-[--color-primary] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}
