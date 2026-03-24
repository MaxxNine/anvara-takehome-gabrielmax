'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/utils';

interface FormModalProps {
  children: ReactNode;
  className?: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export function FormModal({
  children,
  className,
  description,
  onClose,
  open,
  title,
}: FormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }

      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="w-full max-w-2xl rounded-2xl border border-[--color-border] bg-[--color-background] p-0 text-[--color-foreground] shadow-2xl backdrop:bg-slate-950/45"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-start justify-between gap-4 border-b border-[--color-border] px-6 py-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-[--color-muted]">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[--color-border] px-3 py-1.5 text-sm font-medium text-[--color-muted] transition-colors hover:text-[--color-foreground]"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </dialog>
  );
}
