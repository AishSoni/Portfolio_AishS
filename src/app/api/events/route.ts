import { NextRequest, NextResponse } from "next/server";
import { postEvent, type MermEventPayload } from "@/lib/merm/api";

interface EventsBody {
  type: "resume_dwell";
  appId?: string | null;
  contactId?: number | null;
  resumeVersionId: number;
  sessionId?: string | null;
  occurredAt?: string;
  payload: {
    dwellMs: number;
  };
}

function parseEventsBody(raw: unknown): EventsBody | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  if (body.type !== "resume_dwell") return null;
  if (typeof body.resumeVersionId !== "number") return null;
  if (
    !body.payload ||
    typeof body.payload !== "object" ||
    typeof (body.payload as Record<string, unknown>).dwellMs !== "number"
  ) {
    return null;
  }
  return {
    type: body.type,
    appId: typeof body.appId === "string" ? body.appId : undefined,
    contactId: typeof body.contactId === "number" ? body.contactId : undefined,
    resumeVersionId: body.resumeVersionId,
    sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
    occurredAt: typeof body.occurredAt === "string" ? body.occurredAt : undefined,
    payload: {
      dwellMs: (body.payload as Record<string, unknown>).dwellMs as number,
    },
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.MERM_API_URL || !process.env.SECRET_PORTFOLIO) {
    console.error("[api/events] Missing MERM_API_URL or SECRET_PORTFOLIO env");
    return new NextResponse(null, { status: 204 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const body = parseEventsBody(raw);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 422 });
  }

  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "";

  const extraHeaders: Record<string, string> = {
    "User-Agent": req.headers.get("user-agent") ?? "",
  };
  if (forwardedFor) {
    extraHeaders["X-Forwarded-For"] = forwardedFor;
  }

  const eventPayload: MermEventPayload = {
    type: "resume_dwell",
    resumeVersionId: body.resumeVersionId,
    occurredAt: body.occurredAt,
    payload: body.payload,
  };
  if (body.appId != null) eventPayload.appId = body.appId;
  if (body.contactId != null) eventPayload.contactId = body.contactId;
  if (body.sessionId != null) eventPayload.sessionId = body.sessionId;

  await postEvent(eventPayload, extraHeaders);

  return new NextResponse(null, { status: 204 });
}
