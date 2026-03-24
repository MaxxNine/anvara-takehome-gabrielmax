'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { initialActionState } from '@/lib/action-types';
import { resetListingAction } from '../actions/reset-listing';

type ResetListingButtonProps = {
  adSlotId: string;
  className: string;
  label: string;
  pendingLabel: string;
  onErrorChange: (message: string | null) => void;
  onResetSuccess: () => void;
};

type ResetListingSubmitButtonProps = {
  className: string;
  label: string;
  pendingLabel: string;
};

function ResetListingSubmitButton({
  className,
  label,
  pendingLabel,
}: ResetListingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ResetListingButton({
  adSlotId,
  className,
  label,
  pendingLabel,
  onErrorChange,
  onResetSuccess,
}: ResetListingButtonProps) {
  const [state, formAction] = useActionState(resetListingAction, initialActionState);
  const handledSuccessRef = useRef(false);

  useEffect(() => {
    if (state.success && !handledSuccessRef.current) {
      handledSuccessRef.current = true;
      onErrorChange(null);
      onResetSuccess();
      return;
    }

    if (!state.success) {
      handledSuccessRef.current = false;
      onErrorChange(state.error ?? null);
    }
  }, [onErrorChange, onResetSuccess, state.error, state.success]);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="adSlotId" value={adSlotId} />
      <ResetListingSubmitButton
        className={className}
        label={label}
        pendingLabel={pendingLabel}
      />
    </form>
  );
}
