import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { getForcedABTestVariant } from '@/lib/ab-testing';
import { getServerABVariant } from '@/lib/ab-testing/server';
import { AdSlotDetailB } from './components-b/ad-slot-detail-b';
import { AdSlotDetail } from './components/ad-slot-detail';
import {
  getMarketplaceAdSlot,
  getMarketplaceViewer,
  getRelatedMarketplaceAdSlots,
} from './data';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdSlotPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const [adSlot, viewer, ctaVariant, marketplaceVariant] = await Promise.all([
    getMarketplaceAdSlot(id, requestHeaders),
    getMarketplaceViewer(requestHeaders),
    getServerABVariant('cta-button-text', {
      forcedVariant: getForcedABTestVariant('cta-button-text', resolvedSearchParams),
    }),
    getServerABVariant('marketplace-layout', {
      forcedVariant: getForcedABTestVariant('marketplace-layout', resolvedSearchParams),
    }),
  ]);

  if (!adSlot) {
    notFound();
  }

  if (marketplaceVariant === 'B') {
    const relatedSlots = await getRelatedMarketplaceAdSlots(id, requestHeaders);

    return (
      <AdSlotDetailB
        adSlot={adSlot}
        user={viewer.user}
        roleInfo={viewer.roleInfo}
        ctaVariant={ctaVariant}
        relatedSlots={relatedSlots}
      />
    );
  }

  return (
    <AdSlotDetail
      adSlot={adSlot}
      user={viewer.user}
      roleInfo={viewer.roleInfo}
      ctaVariant={ctaVariant}
    />
  );
}
