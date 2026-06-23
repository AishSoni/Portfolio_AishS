import { useMutation } from "@tanstack/react-query";
import { portfolioClient } from "@/client";

export { portfolioClient };

export type SiteAnalyticsEventType = "page_view" | "link_click";

export interface SiteAnalyticsPayload {
  type: SiteAnalyticsEventType;
  sessionId: string;
  payload?: Record<string, unknown>;
}

export interface ResumeDwellPayload {
  type: "resume_dwell";
  appId?: string | null;
  contactId?: number | null;
  resumeVersionId: number;
  occurredAt: string;
  payload: { dwellMs: number };
}

export function useEmitSiteEvent() {
  return useMutation({
    mutationFn: (event: SiteAnalyticsPayload) =>
      portfolioClient.post("/api/analytics", event),
  });
}

export function useEmitResumeDwellEvent() {
  return useMutation({
    mutationFn: (payload: ResumeDwellPayload) =>
      portfolioClient.post("/api/events", payload),
  });
}

export function useCheckAuth() {
  return useMutation({
    mutationFn: () => portfolioClient.get("/api/check-auth"),
  });
}

export function useAuthenticate() {
  return useMutation({
    mutationFn: (password: string) =>
      portfolioClient.post("/api/authenticate", { password }),
  });
}
