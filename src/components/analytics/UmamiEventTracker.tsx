"use client";

import { useEffect } from "react";
import { isAnalyticsAllowed } from "@/lib/analytics/consent";

const EVENT_ATTR = "data-umami-event";

export function UmamiEventTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!isAnalyticsAllowed()) return;
      if (window.location.pathname.startsWith("/dashboard")) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest(`[${EVENT_ATTR}]`);
      if (!el) return;

      const eventName = el.getAttribute(EVENT_ATTR);
      if (!eventName) return;

      const payload: Record<string, string> = {};
      el.getAttributeNames().forEach((attr) => {
        if (attr.startsWith("data-umami-") && attr !== EVENT_ATTR) {
          const value = el.getAttribute(attr);
          if (value !== null) {
            payload[attr.slice("data-umami-".length)] = value;
          }
        }
      });

      window.umami?.track(eventName, payload);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
