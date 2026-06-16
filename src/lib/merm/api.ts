import { createHttpClient } from "@/client";

export interface MermEventPayload {
  type: string;
  appId?: string | null;
  contactId?: number | null;
  resumeVersionId?: number | null;
  sessionId?: string | null;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

function getMermClient() {
  const baseURL = process.env.MERM_API_URL;
  const token = process.env.SECRET_PORTFOLIO;
  if (!baseURL || !token) {
    throw new Error("Missing MERM_API_URL or SECRET_PORTFOLIO");
  }
  return createHttpClient({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeoutMs: 3_000,
  });
}

/** Fire-and-forget event POST to MERM (server-side). */
export async function postEvent(
  event: MermEventPayload,
  extraHeaders?: Record<string, string>
): Promise<void> {
  try {
    await getMermClient().post(
      "/events",
      {
        ...event,
        occurredAt: event.occurredAt ?? new Date().toISOString(),
      },
      extraHeaders ? { headers: extraHeaders } : undefined
    );
  } catch (err) {
    console.error("[merm] postEvent failed:", event.type, err);
  }
}
