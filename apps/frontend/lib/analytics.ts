export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: AnalyticsEventParams
    ) => void;
  }
}

export const GA_EVENTS = {
  CTA_CLICK: 'cta_click',
  NAV_CLICK: 'nav_click',
  LOGIN_SUCCESS: 'login_success',
  LOGOUT: 'logout',
  AD_SLOT_CLICK: 'ad_slot_click',
  AD_SLOT_VIEW: 'ad_slot_view',
  PLACEMENT_REQUEST: 'placement_request',
  PLACEMENT_SUCCESS: 'placement_success',
} as const;

export function trackEvent(
  eventName: string,
  params?: AnalyticsEventParams
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, params);
}
