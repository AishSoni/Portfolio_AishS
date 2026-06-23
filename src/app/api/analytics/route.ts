import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/resources";
import { postAnalyticsToMerm } from "@/queries/server";

type AnalyticsEventType = "page_view" | "link_click";

interface AnalyticsBody {
  type: AnalyticsEventType;
  sessionId: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

function parseAnalyticsBody(raw: unknown): AnalyticsBody | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  if (body.type !== "page_view" && body.type !== "link_click") return null;
  if (typeof body.sessionId !== "string" || body.sessionId.length === 0) {
    return null;
  }
  const payload =
    body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
      ? (body.payload as Record<string, unknown>)
      : undefined;
  const occurredAt =
    typeof body.occurredAt === "string" ? body.occurredAt : undefined;
  return {
    type: body.type,
    sessionId: body.sessionId,
    payload,
    occurredAt,
  };
}

/**
 * Low-trust analytics proxy — forwards browser events to MERM without SECRET_PORTFOLIO.
 * MERM resolves userId from the registered portfolio Origin (spec 03, spec 15).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const mermUrl = process.env.MERM_API_URL;
  if (!mermUrl) {
    return new NextResponse(null, { status: 204 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const body = parseAnalyticsBody(raw);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 422 });
  }

  const origin = process.env.PORTFOLIO_ORIGIN ?? baseURL;
  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "";

  const extraHeaders: Record<string, string> = {
    Origin: origin,
    "User-Agent": req.headers.get("user-agent") ?? "",
  };
  if (forwardedFor) {
    extraHeaders["X-Forwarded-For"] = forwardedFor;
  }

  await postAnalyticsToMerm(body, extraHeaders);

  return new NextResponse(null, { status: 204 });
}
