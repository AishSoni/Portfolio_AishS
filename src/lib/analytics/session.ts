const SESSION_KEY = "merm_session_id";

/** First-party anonymous visitor session id (spec 15 §4). */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(SESSION_KEY, id);
  return id;
}
