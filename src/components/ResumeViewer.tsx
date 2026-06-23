"use client";

import { useEffect, useRef, useState } from "react";
import { useEmitResumeDwellEvent } from "@/queries/client";

const DWELL_MIN_MS = 5_000; // 5 seconds to qualify as "human" (spec 08)

interface ResumeViewerProps {
  signedUrl: string;
  resumeId: string;
  resumeVersionId: number;
  appId?: string | null;
  contactId?: number | null;
  label?: string;
}

export function ResumeViewer({
  signedUrl,
  resumeId,
  resumeVersionId,
  appId,
  contactId,
  label,
}: ResumeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useEmitResumeDwellEvent();

  useEffect(() => {
    let dwellTimer: ReturnType<typeof setTimeout>;

    const loadPdf = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const pdf = await pdfjsLib.getDocument({ url: signedUrl }).promise;
        setPdfLoaded(true);

        const container = containerRef.current;
        if (!container) return;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.marginBottom = "8px";

          const ctx = canvas.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, canvas, viewport }).promise;
          }
          container.appendChild(canvas);
        }

        // Start dwell timer once PDF is visible
        dwellTimer = setTimeout(() => {
          mutate({
            type: "resume_dwell",
            appId: appId ?? null,
            contactId: contactId ?? null,
            resumeVersionId,
            occurredAt: new Date().toISOString(),
            payload: { dwellMs: DWELL_MIN_MS },
          });
        }, DWELL_MIN_MS);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load PDF"
        );
      }
    };

    loadPdf();

    return () => {
      clearTimeout(dwellTimer);
    };
  }, [signedUrl, appId, contactId, resumeVersionId, mutate]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: "var(--font-body), system-ui, sans-serif",
          color: "var(--neutral-on-background)",
        }}
      >
        <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
          Failed to load resume
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--neutral-on-background-weak)" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "var(--font-body), system-ui, sans-serif",
        color: "var(--neutral-on-background)",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          background: "var(--page-background)",
          borderBottom: "1px solid var(--neutral-alpha-weak)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--neutral-on-background-weak)",
          }}
        >
          {label ?? `Resume ${resumeId}`}
        </span>
        <a
          href={signedUrl}
          download
          style={{
            fontSize: "0.875rem",
            color: "var(--brand-on-background)",
            textDecoration: "none",
            padding: "6px 16px",
            borderRadius: "8px",
            background: "var(--brand-background-strong)",
            transition: "opacity 0.2s",
          }}
        >
          Download
        </a>
      </div>

      {/* PDF canvas container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "16px",
        }}
      />

      {!pdfLoaded && !error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            color: "var(--neutral-on-background-weak)",
          }}
        >
          Loading PDF...
        </div>
      )}
    </div>
  );
}
