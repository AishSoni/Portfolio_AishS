const MERM_API_URL = process.env.MERM_API_URL!;
const SECRET_PORTFOLIO = process.env.SECRET_PORTFOLIO!;

export interface MermEvent {
  type: string;
  appId?: string | null;
  contactId?: number | null;
  resumeVersionId?: number | null;
  sessionId?: string | null;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

export async function emitEvent(event: MermEvent): Promise<void> {
  if (!MERM_API_URL || !SECRET_PORTFOLIO) {
    console.error("[events] Missing MERM_API_URL or SECRET_PORTFOLIO");
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    await fetch(`${MERM_API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SECRET_PORTFOLIO}`,
      },
      body: JSON.stringify({
        ...event,
        occurredAt: event.occurredAt ?? new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (err) {
    // Fire-and-forget: log only, never block the caller
    console.error("[events] Failed to emit event:", event.type, err);
  }
}
