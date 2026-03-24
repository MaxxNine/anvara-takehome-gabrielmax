import type { AnalyticsEventMap, AnalyticsEventName } from './events';

type AnalyticsEventValue = string | number | boolean | undefined;

type AnyAnalyticsEventParams = AnalyticsEventMap[AnalyticsEventName];

type TrackEventArgs<K extends AnalyticsEventName> =
  undefined extends AnalyticsEventMap[K]
    ? [params?: AnalyticsEventMap[K]]
    : [params: AnalyticsEventMap[K]];

type TrackEventAndWaitArgs<K extends AnalyticsEventName> =
  undefined extends AnalyticsEventMap[K]
    ? [params?: AnalyticsEventMap[K], timeout?: number]
    : [params: AnalyticsEventMap[K], timeout?: number];

type TrackEventAndRunArgs<K extends AnalyticsEventName> =
  undefined extends AnalyticsEventMap[K]
    ? [run: () => void | Promise<void>, params?: AnalyticsEventMap[K], timeout?: number]
    : [run: () => void | Promise<void>, params: AnalyticsEventMap[K], timeout?: number];

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

function getGtag() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return null;
  }

  return window.gtag;
}

export function isAnalyticsEnabled(): boolean {
  return getGtag() !== null;
}

function sendEvent(
  eventName: AnalyticsEventName,
  params?: AnyAnalyticsEventParams
): void {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  gtag('event', eventName, {
    ...(params ?? {}),
    transport_type: 'beacon',
  });
}

async function sendEventAndWait(
  eventName: AnalyticsEventName,
  params?: AnyAnalyticsEventParams,
  timeout = 300
): Promise<void> {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

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

export function trackEvent<K extends AnalyticsEventName>(
  eventName: K,
  ...args: TrackEventArgs<K>
): void {
  sendEvent(eventName, args[0] as AnyAnalyticsEventParams);
}

export async function trackEventAndWait<K extends AnalyticsEventName>(
  eventName: K,
  ...args: TrackEventAndWaitArgs<K>
): Promise<void> {
  await sendEventAndWait(
    eventName,
    args[0] as AnyAnalyticsEventParams,
    args[1] ?? 300
  );
}

export async function trackEventAndRun<K extends AnalyticsEventName>(
  eventName: K,
  ...args: TrackEventAndRunArgs<K>
): Promise<void> {
  const run = args[0];
  const params = args[1];
  const timeout = args[2] ?? 300;

  await sendEventAndWait(eventName, params as AnyAnalyticsEventParams, timeout);
  await run();
}
