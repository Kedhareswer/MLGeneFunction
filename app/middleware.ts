import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // --- Production-ready rate limiting placeholder ---
  // Next.js Edge Middleware does NOT support in-memory state (stateless/serverless).
  // You must use a distributed store (e.g., Redis, Upstash) for rate limiting in production.
  // Example: Use a signed cookie, or extract IP from headers for identification.

  // Extract IP address from headers (works on Vercel, Netlify, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

  // TODO: Implement production rate limiting here using a distributed store (e.g., Upstash Redis, Cloudflare KV, etc.)
  // Example pseudo-code:
  // const allowed = await checkRateLimit(ip);
  // if (!allowed) {
  //   return new NextResponse('Too many requests', { status: 429 });
  // }

  // For now, just pass through (no rate limiting in dev)
  return NextResponse.next();
}


export const config = {
  matcher: '/api/:path*',
};
