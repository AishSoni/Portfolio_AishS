import { getSupabase } from "./supabase";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

function isBase36(str: string): boolean {
  return str.length > 0 && [...str].every((c) => ALPHABET.includes(c));
}

export function parseResumeIdFromPath(seg: string): string | null {
  const cleaned = seg.toLowerCase().trim();
  if (!cleaned || !isBase36(cleaned)) return null;
  return cleaned;
}

export function validateAppId(seg: string): string | null {
  const cleaned = seg.toLowerCase().trim();
  if (cleaned.length !== 6 || !isBase36(cleaned)) return null;
  return cleaned;
}

export function validateLinkToken(seg: string): string | null {
  const cleaned = seg.toLowerCase().trim();
  if (cleaned.length !== 4 || !isBase36(cleaned)) return null;
  return cleaned;
}

export interface Resume {
  id: number;
  userId: string;
  resumeId: string;
  label: string;
  filePath: string;
  originalFilename: string | null;
  mime: string | null;
  size: number | null;
  isCanonical: boolean;
  isPublic: boolean;
  updatedAt: string;
}

export interface TrackedLink {
  id: number;
  userId: string;
  resumeId: string;
  appId: string;
  contactId: number | null;
  linkToken: string | null;
}

export type ResolveResult =
  | { mode: "outreach"; resume: Resume; trackedLink: TrackedLink }
  | { mode: "public"; resume: Resume }
  | { mode: "blocked"; canonicalResumeId: string };

export async function getCanonical(userId: string): Promise<Resume | null> {
  const { data, error } = await getSupabase()
    .from("resumes")
    .select("*")
    .eq("userId", userId)
    .eq("isCanonical", true)
    .single();

  if (error || !data) return null;
  return data as Resume;
}

export async function resolveResume(
  userId: string,
  resumeId: string,
  appId?: string,
  linkToken?: string
): Promise<ResolveResult> {
  // 1. Load the resume scoped to this user
  const { data: resume, error: resumeError } = await getSupabase()
    .from("resumes")
    .select("*")
    .eq("userId", userId)
    .eq("resumeId", resumeId)
    .single();

  if (resumeError || !resume) {
    const canonical = await getCanonical(userId);
    return {
      mode: "blocked",
      canonicalResumeId: canonical?.resumeId ?? "00",
    };
  }

  // 2. If appId present → try to resolve tracked_link
  if (appId) {
    let query = getSupabase()
      .from("tracked_links")
      .select("*")
      .eq("userId", userId)
      .eq("resumeId", resumeId)
      .eq("appId", appId);

    if (linkToken) {
      // Per-contact link: find by linkToken, assert it matches
      query = query.eq("linkToken", linkToken);
    } else {
      // Generic link: contactId IS NULL
      query = query.is("contactId", null);
    }

    const { data: trackedLink } = await query.maybeSingle();

    if (trackedLink) {
      return {
        mode: "outreach",
        resume: resume as Resume,
        trackedLink: trackedLink as TrackedLink,
      };
    }
    // No match → fall through to public check (do NOT 404)
  }

  // 3. Public resume check
  if ((resume as Resume).isPublic) {
    return { mode: "public", resume: resume as Resume };
  }

  // 4. Non-public + no valid tracked_link → redirect to canonical
  const canonical = await getCanonical(userId);
  return {
    mode: "blocked",
    canonicalResumeId: canonical?.resumeId ?? "00",
  };
}
