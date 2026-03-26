import { prisma } from '../../db.js';
import type {
  CampaignListFilters,
  CreateCampaignInput,
  UpdateCampaignInput,
} from '../../types/index.js';

export {
  buildCreateCampaignInput,
  buildUpdateCampaignInput,
  isCampaignStatus,
} from './campaign.helpers.js';

const campaignSummaryInclude = {
  sponsor: { select: { id: true, name: true } },
};

export async function listCampaigns(filters: CampaignListFilters) {
  return prisma.campaign.findMany({
    where: {
      ...(filters.status && { status: filters.status }),
      ...(filters.sponsorId && { sponsorId: filters.sponsorId }),
    },
    include: {
      sponsor: { select: { id: true, name: true, logo: true } },
      _count: { select: { creatives: true, placements: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCampaignById(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      sponsor: true,
      creatives: true,
      placements: {
        include: {
          adSlot: true,
          publisher: { select: { id: true, name: true, category: true } },
        },
      },
    },
  });
}

export async function createCampaign(data: CreateCampaignInput) {
  return prisma.campaign.create({
    data,
    include: campaignSummaryInclude,
  });
}

export async function updateCampaign(id: string, data: UpdateCampaignInput) {
  return prisma.campaign.update({
    where: { id },
    data,
    include: campaignSummaryInclude,
  });
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({
    where: { id },
  });
}
