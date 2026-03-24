import type { AdSlot, AdSlotType, Campaign, CampaignStatus } from '../types';

type AnalyticsEventValue = string | number | boolean | undefined;

export type AnalyticsEventParams = Record<string, AnalyticsEventValue>;

export type ConversionType = 'micro' | 'macro';

export type AdSlotAnalyticsParams = {
  ad_slot_id: string;
  ad_slot_name?: string;
  ad_slot_type: AdSlotType;
  price?: number;
  publisher_name?: string;
};

export type CampaignAnalyticsParams = {
  budget: number;
  campaign_id: string;
  campaign_name: string;
  status: CampaignStatus;
};

export type MicroConversionEvent =
  | 'ad_slot_click'
  | 'ad_slot_view'
  | 'cta_click'
  | 'marketplace_view'
  | 'nav_click';

export type MacroConversionEvent =
  | 'login_success'
  | 'placement_request_submit'
  | 'placement_request_success'
  | 'signup_complete';

export type EngagementEvent = 'form_error' | 'form_submit' | 'logout';
export type ExperimentEvent = 'variant_assigned';

export type AnalyticsEventMap = {
  ad_slot_click: AdSlotAnalyticsParams;
  ad_slot_view: AdSlotAnalyticsParams & {
    conversion_type?: 'micro';
  };
  cta_click: {
    label: string;
    location: string;
  };
  form_error: {
    error_type: 'server' | 'validation';
    form: string;
  };
  form_submit: {
    form: string;
  };
  login_success: {
    method: string;
  };
  logout: undefined;
  marketplace_view: {
    conversion_type?: 'micro';
    results_count: number;
  };
  nav_click: {
    destination: string;
  };
  page_view: {
    page_location?: string;
    page_path: string;
    page_title?: string;
  };
  placement_request: {
    ad_slot_id: string;
  };
  placement_request_submit: AdSlotAnalyticsParams & {
    conversion_type: 'macro';
  };
  placement_request_success: AdSlotAnalyticsParams & {
    conversion_type: 'macro';
  };
  placement_success: {
    ad_slot_id: string;
  };
  signup_complete: {
    method?: string;
  };
  variant_assigned: {
    source: 'forced' | 'new_assignment';
    test_name: string;
    variant: string;
  };
};

export type AnalyticsEventName =
  | keyof AnalyticsEventMap
  | MicroConversionEvent
  | MacroConversionEvent
  | EngagementEvent
  | ExperimentEvent;

export const GA_EVENTS = {
  AD_SLOT_CLICK: 'ad_slot_click',
  AD_SLOT_VIEW: 'ad_slot_view',
  CTA_CLICK: 'cta_click',
  FORM_ERROR: 'form_error',
  FORM_SUBMIT: 'form_submit',
  LOGIN_SUCCESS: 'login_success',
  LOGOUT: 'logout',
  MARKETPLACE_VIEW: 'marketplace_view',
  NAV_CLICK: 'nav_click',
  PAGE_VIEW: 'page_view',
  PLACEMENT_REQUEST: 'placement_request',
  PLACEMENT_REQUEST_SUBMIT: 'placement_request_submit',
  PLACEMENT_REQUEST_SUCCESS: 'placement_request_success',
  PLACEMENT_SUCCESS: 'placement_success',
  SIGNUP_COMPLETE: 'signup_complete',
  VARIANT_ASSIGNED: 'variant_assigned',
} as const satisfies Record<string, AnalyticsEventName>;

function toNumericValue(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export function adSlotEventParams(adSlot: AdSlot): AdSlotAnalyticsParams {
  return {
    ad_slot_id: adSlot.id,
    ad_slot_name: adSlot.name,
    ad_slot_type: adSlot.type,
    price: toNumericValue(adSlot.basePrice),
    publisher_name: adSlot.publisher?.name,
  };
}

export function campaignEventParams(campaign: Campaign): CampaignAnalyticsParams {
  return {
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    budget: toNumericValue(campaign.budget),
    status: campaign.status,
  };
}
