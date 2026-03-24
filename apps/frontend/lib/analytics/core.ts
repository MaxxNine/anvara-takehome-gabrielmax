import type { AnalyticsEventMap, AnalyticsEventName } from './events';

type AnalyticsEventValue = string | number | boolean | undefined;

type AnyAnalyticsEventParams = AnalyticsEventMap[AnalyticsEventName];
type AnalyticsDebugMode = 'fire_and_forget' | 'wait';

export type AnalyticsDebugEvent = {
  eventName: AnalyticsEventName;
  mode: AnalyticsDebugMode;
  params?: AnyAnalyticsEventParams;
  timestamp: number;
};

export const ANALYTICS_DEBUG_EVENT_NAME = 'anvara:analytics-debug';
const MAX_DEBUG_EVENTS = 200;

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
    __analyticsDebugEvents?: AnalyticsDebugEvent[];
    gtag?: (
      command: 'event',
      eventName: string,
      params?: GtagEventParams
    ) => void;
  }
}

function isAnalyticsDebugEnabled(): boolean {
  return typeof window !== 'undefined' && process.env.NODE_ENV !== 'production';
}

function recordDebugEvent(
  eventName: AnalyticsEventName,
  mode: AnalyticsDebugMode,
  params?: AnyAnalyticsEventParams
): void {
  if (!isAnalyticsDebugEnabled()) {
    return;
  }

  const event: AnalyticsDebugEvent = {
    eventName,
    mode,
    params,
    timestamp: Date.now(),
  };

  const events = window.__analyticsDebugEvents ?? [];

  if (!window.__analyticsDebugEvents) {
    window.__analyticsDebugEvents = events;
  }

  events.push(event);

  if (events.length > MAX_DEBUG_EVENTS) {
    events.splice(0, events.length - MAX_DEBUG_EVENTS);
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_DEBUG_EVENT_NAME, { detail: event }));
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
  recordDebugEvent(eventName, 'fire_and_forget', params);

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
  recordDebugEvent(eventName, 'wait', params);

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
