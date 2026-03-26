// Core types matching the Prisma schema

export type UserRole = 'sponsor' | 'publisher';
export type DecimalValue = number | string;
export type CampaignStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED';
export type AdSlotType = 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
export type PricingModel = 'CPM' | 'CPC' | 'CPA' | 'FLAT_RATE';
export type PlacementStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REJECTED';
export type CreativeType = 'BANNER' | 'VIDEO' | 'NATIVE' | 'SPONSORED_POST' | 'PODCAST_READ';

export interface SponsorSummary {
  id: string;
  name: string;
  logo?: string | null;
}

export interface PublisherSummary {
  id: string;
  name: string;
  category?: string | null;
  website?: string | null;
  monthlyViews?: number;
  subscriberCount?: number;
  bio?: string | null;
  avatar?: string | null;
  isVerified?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  budget: DecimalValue;
  spent: DecimalValue;
  cpmRate?: DecimalValue | null;
  cpcRate?: DecimalValue | null;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  targetCategories?: string[];
  targetRegions?: string[];
  sponsorId: string;
  sponsor?: SponsorSummary;
  _count?: { creatives: number; placements: number };
}

export interface AdSlot {
  id: string;
  name: string;
  description?: string | null;
  type: AdSlotType;
  basePrice: DecimalValue;
  isAvailable: boolean;
  publisherId: string;
  width?: number | null;
  height?: number | null;
  publisher?: PublisherSummary;
  _count?: { placements: number };
}

export interface Placement {
  id: string;
  agreedPrice: DecimalValue;
  pricingModel: PricingModel;
  impressions: number;
  clicks: number;
  conversions: number;
  status: PlacementStatus;
  startDate: string;
  endDate: string;
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
  campaign?: { id: string; name: string };
  creative?: { id: string; name: string; type: CreativeType };
  adSlot?: { id: string; name: string; type: AdSlotType };
  publisher?: { id: string; name: string };
}

export interface DashboardStats {
  sponsors: number;
  publishers: number;
  activeCampaigns: number;
  totalPlacements: number;
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCtr: number | string;
  };
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  budget: DecimalValue;
  cpmRate?: DecimalValue;
  cpcRate?: DecimalValue;
  startDate: string;
  endDate: string;
  targetCategories?: string[];
  targetRegions?: string[];
  sponsorId: string;
}

export interface CreateAdSlotInput {
  name: string;
  description?: string;
  type: AdSlotType;
  basePrice: DecimalValue;
  publisherId: string;
  width?: number;
  height?: number;
}

export interface CreatePlacementInput {
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
  agreedPrice: DecimalValue;
  pricingModel?: PricingModel;
  startDate: string;
  endDate: string;
}

export interface RoleInfo {
  role: UserRole | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
