export type SiteAnalyticsEventType = "page_view" | "link_click";

export interface SiteAnalyticsPayload {
  type: SiteAnalyticsEventType;
  sessionId: string;
  payload?: Record<string, unknown>;
}

/** Fire-and-forget POST to the portfolio analytics proxy (spec 15 §4). */
export function emitSiteEvent(event: SiteAnalyticsPayload): void {
  if (typeof window === "undefined") return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => {
    // Analytics loss is acceptable under abuse or network failure (spec 15 §7).
  });
}
