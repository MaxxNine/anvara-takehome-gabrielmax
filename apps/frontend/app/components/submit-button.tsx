'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

type SubmitButtonVariant = 'primary' | 'danger';

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: ReactNode;
  pendingText?: string;
  variant?: SubmitButtonVariant;
};

const variantStyles: Record<SubmitButtonVariant, string> = {
  primary: 'bg-indigo-500 hover:bg-indigo-600',
  danger: 'bg-red-600 hover:bg-red-700',
};

export function SubmitButton({
  children,
  className,
  disabled,
  pendingText = 'Saving...',
  variant = 'primary',
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
        'inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        className
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}
