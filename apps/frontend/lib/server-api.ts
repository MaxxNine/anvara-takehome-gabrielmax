import 'server-only';

export type ForwardedRequestHeaders = Headers | HeadersInit | undefined;

const SERVER_API_URL =
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4291';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidation() {
    return this.status === 400;
  }
}

const DIRECTLY_FORWARDED_HEADER_NAMES = ['cookie', 'authorization', 'x-real-ip'] as const;

function buildServerApiHeaders(
  requestHeaders?: ForwardedRequestHeaders,
  extraHeaders?: HeadersInit
): Headers {
  const headers = new Headers(extraHeaders);

  if (!requestHeaders) {
    return headers;
  }

  const incomingHeaders = new Headers(requestHeaders);
  for (const headerName of DIRECTLY_FORWARDED_HEADER_NAMES) {
    const headerValue = incomingHeaders.get(headerName);

    if (headerValue && !headers.has(headerName)) {
      headers.set(headerName, headerValue);
    }
  }

  const forwardedFor = incomingHeaders.get('x-forwarded-for');
  const realIp = incomingHeaders.get('x-real-ip');

  if (forwardedFor && !headers.has('x-forwarded-for')) {
    headers.set('x-forwarded-for', forwardedFor);
  } else if (realIp && !headers.has('x-forwarded-for')) {
    headers.set('x-forwarded-for', realIp);
  }

  return headers;
}

export async function serverApi<T>(
  endpoint: string,
  options: RequestInit & { requestHeaders?: ForwardedRequestHeaders } = {}
): Promise<T> {
  const { requestHeaders, headers, ...requestInit } = options;
  const response = await fetch(`${SERVER_API_URL}${endpoint}`, {
    ...requestInit,
    headers: buildServerApiHeaders(requestHeaders, headers),
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // Response body isn't JSON — use the default message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
