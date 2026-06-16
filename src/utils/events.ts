import type { MermEventPayload } from "@/lib/merm/api";
import { postEvent } from "@/lib/merm/api";

export type { MermEventPayload as MermEvent };

export async function emitEvent(event: MermEventPayload): Promise<void> {
  if (!process.env.MERM_API_URL || !process.env.SECRET_PORTFOLIO) {
    console.error("[events] Missing MERM_API_URL or SECRET_PORTFOLIO");
    return;
  }
  await postEvent(event);
}
