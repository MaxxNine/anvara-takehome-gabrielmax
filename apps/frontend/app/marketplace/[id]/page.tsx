import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { AdSlotDetail } from './components/ad-slot-detail';
import { getMarketplaceAdSlot, getMarketplaceViewer } from './data';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdSlotPage({ params }: Props) {
  const { id } = await params;
  const requestHeaders = await headers();
  const [adSlot, viewer] = await Promise.all([
    getMarketplaceAdSlot(id, requestHeaders),
    getMarketplaceViewer(requestHeaders),
  ]);

  if (!adSlot) {
    notFound();
  }

  return <AdSlotDetail adSlot={adSlot} user={viewer.user} roleInfo={viewer.roleInfo} />;
}
