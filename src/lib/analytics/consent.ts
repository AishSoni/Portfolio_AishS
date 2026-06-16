const OPT_OUT_KEY = "merm_analytics_opt_out";

/** Whether site analytics emission is allowed (spec 15 §4, §7). */
export function isAnalyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;

  if (localStorage.getItem(OPT_OUT_KEY) === "1") return false;

  const dnt =
    navigator.doNotTrack === "1" ||
    (window as Window & { doNotTrack?: string }).doNotTrack === "1";
  if (dnt) return false;

  return true;
}

export function setAnalyticsOptOut(optOut: boolean): void {
  if (typeof window === "undefined") return;
  if (optOut) {
    localStorage.setItem(OPT_OUT_KEY, "1");
  } else {
    localStorage.removeItem(OPT_OUT_KEY);
  }
}
