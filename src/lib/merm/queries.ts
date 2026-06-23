import { queryOptions } from "@tanstack/react-query";
import { mermKeys } from "@/constants/query-keys";

/** TanStack query options for MERM endpoints (extend as endpoints are added). */
export const mermQueries = {
  events: {
    all: () =>
      queryOptions({
        queryKey: mermKeys.events.all(),
        queryFn: async () => null,
        enabled: false,
      }),
  },
};

/** Fire-and-forget POST for resume dwell events. */
export function emitResumeDwellEvent(payload: {
  type: "resume_dwell";
  appId?: string | null;
  contactId?: number | null;
  resumeVersionId: number;
  occurredAt: string;
  payload: { dwellMs: number };
}): void {
  if (typeof window === "undefined") return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}
