"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsAllowed } from "@/lib/analytics/consent";
import { getOrCreateSessionId } from "@/lib/analytics/session";
import { isTrackablePath } from "@/lib/analytics/trackable";
import { useEmitSiteEvent } from "@/queries/client";

export function SiteAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAnalyticsAllowed() || !isTrackablePath(pathname)) return;
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    emitSiteEvent({
      type: "page_view",
      sessionId: getOrCreateSessionId(),
      payload: {
        path: pathname,
        referrer: document.referrer || "",
        title: document.title,
      },
    });
  }, [pathname]);

  useEffect(() => {
    if (!isAnalyticsAllowed()) return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor?.href) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.origin === window.location.origin) return;
      if (!isTrackablePath(window.location.pathname)) return;

      emitSiteEvent({
        type: "link_click",
        sessionId: getOrCreateSessionId(),
        payload: {
          href: url.href,
          path: window.location.pathname,
        },
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
