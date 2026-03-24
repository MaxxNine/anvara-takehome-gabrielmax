import { auth } from '@/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { applyAuthRouteRateLimit } from './auth-rate-limit';

const authHandlers = toNextJsHandler(auth);

async function withAuthRouteRateLimit(
  handler: (request: Request) => Promise<Response>,
  request: Request
): Promise<Response> {
  const rateLimitResponse = await applyAuthRouteRateLimit(request);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return handler(request);
}

export async function GET(request: Request): Promise<Response> {
  return withAuthRouteRateLimit(authHandlers.GET, request);
}

export async function POST(request: Request): Promise<Response> {
  return withAuthRouteRateLimit(authHandlers.POST, request);
}

export async function PATCH(request: Request): Promise<Response> {
  return withAuthRouteRateLimit(authHandlers.PATCH, request);
}

export async function PUT(request: Request): Promise<Response> {
  return withAuthRouteRateLimit(authHandlers.PUT, request);
}

export async function DELETE(request: Request): Promise<Response> {
  return withAuthRouteRateLimit(authHandlers.DELETE, request);
}
