import 'server-only';

export type ForwardedRequestHeaders = Headers | HeadersInit | undefined;

const SERVER_API_URL =
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4291';

function buildServerApiHeaders(
  requestHeaders?: ForwardedRequestHeaders,
  extraHeaders?: HeadersInit
): Headers {
  const headers = new Headers(extraHeaders);

  if (!requestHeaders) {
    return headers;
  }

  const incomingHeaders = new Headers(requestHeaders);
  const cookie = incomingHeaders.get('cookie');
  const authorization = incomingHeaders.get('authorization');

  if (cookie && !headers.has('cookie')) {
    headers.set('cookie', cookie);
  }

  if (authorization && !headers.has('authorization')) {
    headers.set('authorization', authorization);
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
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
