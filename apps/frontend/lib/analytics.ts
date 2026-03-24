import type { AdSlotType } from './types';

type AnalyticsEventValue = string | number | boolean | undefined;

export type AnalyticsEventMap = {
  ad_slot_click: {
    ad_slot_id: string;
    ad_slot_name: string;
    ad_slot_type: AdSlotType;
  };
  ad_slot_view: {
    ad_slot_id: string;
    ad_slot_type: AdSlotType;
    price: number;
  };
  cta_click: {
    label: string;
    location: string;
  };
  login_success: {
    method: string;
  };
  logout: undefined;
  nav_click: {
    destination: string;
  };
  placement_request: {
    ad_slot_id: string;
  };
  placement_success: {
    ad_slot_id: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

type TrackEventArgs<K extends AnalyticsEventName> =
  undefined extends AnalyticsEventMap[K]
    ? [params?: AnalyticsEventMap[K]]
    : [params: AnalyticsEventMap[K]];

type TrackEventAndWaitArgs<K extends AnalyticsEventName> =
  undefined extends AnalyticsEventMap[K]
    ? [params?: AnalyticsEventMap[K], timeout?: number]
    : [params: AnalyticsEventMap[K], timeout?: number];

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
} as const satisfies Record<string, AnalyticsEventName>;

export function trackEvent<K extends AnalyticsEventName>(
  eventName: K,
  ...args: TrackEventArgs<K>
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const params = args[0];

  window.gtag('event', eventName, {
    ...(params ?? {}),
    transport_type: 'beacon',
  });
}

export async function trackEventAndWait<K extends AnalyticsEventName>(
  eventName: K,
  ...args: TrackEventAndWaitArgs<K>
): Promise<void> {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const params = args[0];
  const timeout = args[1] ?? 300;
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
      ...(params ?? {}),
      event_callback: finish,
      event_timeout: timeout,
      transport_type: 'beacon',
    });

    window.setTimeout(finish, timeout);
  });
}
