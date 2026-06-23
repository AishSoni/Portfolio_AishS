import { createHttpClient } from "@/client";

type AnalyticsEventType = "page_view" | "link_click";

interface AnalyticsBody {
  type: AnalyticsEventType;
  sessionId: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

export async function postAnalyticsToMerm(
  body: AnalyticsBody,
  extraHeaders: Record<string, string>
): Promise<void> {
  const mermUrl = process.env.MERM_API_URL;
  if (!mermUrl) return;

  const client = createHttpClient({
    baseURL: mermUrl.replace(/\/$/, ""),
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    timeoutMs: 5_000,
  });

  try {
    await client.post("/events", {
      ...body,
      occurredAt: body.occurredAt ?? new Date().toISOString(),
    });
  } catch {
    // Fire-and-forget — never block the caller.
  }
}

export async function fetchGoogleFont(font: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(cssUrl)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
