import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  parseResumeIdFromPath,
  validateAppId,
  validateLinkToken,
  resolveResume,
  getCanonical,
} from "@/utils/resume";
import { emitEvent } from "@/utils/events";
import { getSupabase } from "@/utils/supabase";
import { getMermUserId } from "@/utils/merm";
import { ResumeViewer } from "@/components/ResumeViewer";

interface PageParams {
  resumeId: string;
  slug?: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { resumeId: rawResumeId } = await params;
  return {
    title: `Resume ${rawResumeId}`,
    robots: { index: false, follow: false },
  };
}

async function ResumePageInner({ params }: { params: Promise<PageParams> }) {
  const { resumeId: rawResumeId, slug } = await params;

  const userId = getMermUserId();

  // 1. Parse and validate resumeId (variable-length base36)
  const resumeId = parseResumeIdFromPath(rawResumeId);
  if (!resumeId) {
    const canonical = await getCanonical(userId);
    if (canonical) {
      redirect(`/r-${canonical.resumeId}`);
    }
    notFound();
  }

  // 2. Parse optional slug segments: [appId, linkToken?]
  let appId: string | undefined;
  let linkToken: string | undefined;

  if (slug && slug.length > 0) {
    const validatedAppId = validateAppId(slug[0]);
    if (!validatedAppId) {
      const canonical = await getCanonical(userId);
      if (canonical) {
        redirect(`/r-${canonical.resumeId}`);
      }
      notFound();
    }
    appId = validatedAppId;

    if (slug.length > 1) {
      const validatedToken = validateLinkToken(slug[1]);
      if (!validatedToken) {
        const canonical = await getCanonical(userId);
        if (canonical) {
          redirect(`/r-${canonical.resumeId}`);
        }
        notFound();
      }
      linkToken = validatedToken;
    }
  }

  // 3. Resolve resume
  const result = await resolveResume(userId, resumeId, appId, linkToken);

  // 4. Handle blocked → redirect to canonical + audit event
  if (result.mode === "blocked") {
    // Emit resume_access_blocked audit event (fire-and-forget)
    emitEvent({
      type: "resume_access_blocked",
      appId: null,
      resumeVersionId: null,
      payload: {
        requestedResumeId: resumeId,
        outcome: "redirected_to_canonical",
      },
    });

    redirect(`/r-${result.canonicalResumeId}`);
  }

  // 5. Mint signed URL (60s TTL)
  const resume = result.resume;
  const { data: signedUrlData, error: signedUrlError } =
    await getSupabase().storage
      .from("resumes")
      .createSignedUrl(resume.filePath, 60);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("[resume] Failed to mint signed URL:", signedUrlError);
    notFound();
  }

  // Cache-bust + security: append ?v=updatedAt
  const signedUrl = `${signedUrlData.signedUrl}?v=${encodeURIComponent(resume.updatedAt)}`;

  // 6. Emit resume_view event (fire-and-forget)
  const mode = result.mode;
  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "";
  const eventHeaders: Record<string, string> = {
    "User-Agent": requestHeaders.get("user-agent") ?? "",
  };
  if (clientIp) {
    eventHeaders["X-Forwarded-For"] = clientIp;
  }

  emitEvent(
    {
      type: "resume_view",
      appId: mode === "outreach" ? result.trackedLink.appId : null,
      contactId: mode === "outreach" ? result.trackedLink.contactId ?? null : null,
      resumeVersionId: resume.id,
      payload: {
        sessionId:
          mode === "public"
            ? (crypto.randomUUID?.() ?? null)
            : null,
      },
    },
    eventHeaders
  );

  // 7. Render inline PDF viewer
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--page-background)",
      }}
    >
      <ResumeViewer
        signedUrl={signedUrl}
        resumeId={resume.resumeId}
        resumeVersionId={resume.id}
        appId={mode === "outreach" ? result.trackedLink.appId : null}
        contactId={mode === "outreach" ? result.trackedLink.contactId ?? null : null}
        label={resume.label}
      />
    </div>
  );
}

export default async function ResumePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "var(--font-body), system-ui, sans-serif",
          }}
        >
          Loading...
        </div>
      }
    >
      <ResumePageInner params={params} />
    </Suspense>
  );
}
