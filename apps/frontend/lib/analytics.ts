type AnalyticsEventValue = string | number | boolean | undefined;

export type AnalyticsEventParams = Record<string, AnalyticsEventValue>;

type GtagEventParams = Record<string, AnalyticsEventValue | (() => void)> & {
  event_callback?: () => void;
  event_timeout?: number;
  transport_type?: 'beacon';
};

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: GtagEventParams
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

  window.gtag('event', eventName, {
    ...params,
    transport_type: 'beacon',
  });
}

export async function trackEventAndWait(
  eventName: string,
  params?: AnalyticsEventParams,
  timeout = 300
): Promise<void> {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const gtag = window.gtag;

  await new Promise<void>((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      resolve();
    };

    gtag('event', eventName, {
      ...params,
      event_callback: finish,
      event_timeout: timeout,
      transport_type: 'beacon',
    });

    window.setTimeout(finish, timeout);
  });
}
