import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getCurrentUserProfile } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';
import { getPublisherAdSlots } from './data';

export default async function PublisherDashboard() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getCurrentUserProfile(requestHeaders);
  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  const adSlots = await getPublisherAdSlots(requestHeaders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <CreateAdSlotButton />
      </div>

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
