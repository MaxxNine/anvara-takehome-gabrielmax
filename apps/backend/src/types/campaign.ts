import type { CampaignStatus } from '../db.js';

export type CampaignStatusValue = (typeof CampaignStatus)[keyof typeof CampaignStatus];

export interface CampaignListFilters {
  sponsorId?: string;
  status?: CampaignStatusValue;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  budget: number;
  cpmRate?: number;
  cpcRate?: number;
  startDate: Date;
  endDate: Date;
  targetCategories: string[];
  targetRegions: string[];
  sponsorId: string;
}

export interface UpdateCampaignInput {
  name?: string;
  description?: string | null;
  budget?: number;
  cpmRate?: number | null;
  cpcRate?: number | null;
  startDate?: Date;
  endDate?: Date;
  targetCategories?: string[];
  targetRegions?: string[];
  status?: CampaignStatusValue;
}
