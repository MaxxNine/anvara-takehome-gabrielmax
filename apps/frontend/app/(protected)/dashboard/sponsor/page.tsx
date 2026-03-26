import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getCurrentUserProfile } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';
import { getSponsorCampaigns } from './data';

export default async function SponsorDashboard() {
  const requestHeaders = await headers();

  // Verify user has 'sponsor' role
  const roleData = await getCurrentUserProfile(requestHeaders);
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  const campaigns = await getSponsorCampaigns(requestHeaders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <CreateCampaignButton />
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
