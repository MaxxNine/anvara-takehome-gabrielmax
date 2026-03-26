'use client';

import { useActionState, useEffect, useRef } from 'react';

import { ActionErrorNotice } from '@/app/components/action-error-notice';
import { SubmitButton } from '@/app/components/submit-button';
import { getABTestVariantLabel, useABTest } from '@/lib/ab-testing';
import { initialActionState } from '@/lib/action-types';
import { adSlotEventParams, GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { AdSlot } from '@/lib/types';
import { bookPlacementAction } from '../actions/book-placement';

type PlacementRequestFormProps = {
  adSlot: AdSlot;
  companyName: string;
  initialCtaVariant: string;
  onBooked: () => void;
};

export function PlacementRequestForm({
  adSlot,
  companyName,
  initialCtaVariant,
  onBooked,
}: PlacementRequestFormProps) {
  const [state, formAction] = useActionState(bookPlacementAction, initialActionState);
  const handledSuccessRef = useRef(false);
  const adSlotId = adSlot.id;
  const ctaVariant = useABTest('cta-button-text', initialCtaVariant);
  const ctaLabel = getABTestVariantLabel('cta-button-text', ctaVariant) ?? 'Book This Placement';

  useEffect(() => {
    if (state.success && !handledSuccessRef.current) {
      handledSuccessRef.current = true;
      trackEvent(GA_EVENTS.PLACEMENT_REQUEST_SUCCESS, {
        ...adSlotEventParams(adSlot),
        conversion_type: 'macro',
        cta_variant: ctaVariant,
      });
      trackEvent(GA_EVENTS.PLACEMENT_SUCCESS, {
        ad_slot_id: adSlotId,
        cta_variant: ctaVariant,
      });
      onBooked();
      return;
    }

    if (!state.success) {
      handledSuccessRef.current = false;
    }
  }, [adSlot, adSlotId, ctaVariant, onBooked, state.success]);

  function handleSubmit(): void {
    trackEvent(GA_EVENTS.PLACEMENT_REQUEST_SUBMIT, {
      ...adSlotEventParams(adSlot),
      conversion_type: 'macro',
      cta_variant: ctaVariant,
    });
    trackEvent(GA_EVENTS.PLACEMENT_REQUEST, {
      ad_slot_id: adSlotId,
      cta_variant: ctaVariant,
    });
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="adSlotId" value={adSlotId} />

      <ActionErrorNotice state={state} />

      <div>
        <label className="mb-1 block text-sm font-medium text-[--color-muted]">Your Company</label>
        <p className="text-[--color-foreground]">{companyName}</p>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-[--color-muted]">
          Message to Publisher (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          defaultValue={state.fieldValues?.message ?? ''}
          placeholder="Tell the publisher about your campaign goals..."
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
        />
        {state.fieldErrors?.message?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.message[0]}</p>
        ) : null}
      </div>

      <SubmitButton className="w-full py-3" pendingText="Booking...">
        {ctaLabel}
      </SubmitButton>
    </form>
  );
}
