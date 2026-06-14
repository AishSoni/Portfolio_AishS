import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<
  string,
  { count: number; windowStart: number }
>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodic cleanup of stale entries (every 5 min)
let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup > 300_000) {
    lastCleanup = now;
    const cutoff = now - 600_000; // 10 min stale
    for (const [key, entry] of rateLimitMap) {
      if (entry.windowStart < cutoff) rateLimitMap.delete(key);
    }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to /r/* resume routes
  if (!pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  cleanupStaleEntries();

  const ip = getClientIP(request);
  const segments = pathname.split("/").filter(Boolean);
  // segments[0] = "r", segments[1] = "r-{resumeId}", segments[2..] = slug
  const hasSlug = segments.length > 2; // appId or linkToken present = tracked path

  // Tighter limit on bare/miss paths (spec 5.2)
  const maxRequests = hasSlug ? 60 : 20;
  const windowMs = 60_000; // 1 minute

  const key = `r:${ip}`;
  if (!checkRateLimit(key, maxRequests, windowMs)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  // Security headers (spec 5.2): prevent caching and Referrer leakage of signed URLs
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = {
  matcher: ["/r/:path*"],
};
