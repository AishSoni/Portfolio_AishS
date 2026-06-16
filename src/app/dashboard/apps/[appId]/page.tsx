import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDashboardRepository } from "@/lib/dashboard";
import { getMermUserId } from "@/utils/merm";
import { ApplicationDetailView } from "@/components/dashboard/ApplicationDetailView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Application",
  robots: { index: false, follow: false },
};

interface AppDetailPageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ events?: string }>;
}

export default async function AppDetailPage({
  params,
  searchParams,
}: AppDetailPageProps) {
  const { appId } = await params;
  const sp = await searchParams;
  const eventPage = Math.max(0, parseInt(sp.events ?? "0", 10) || 0);

  const userId = getMermUserId();
  const repo = getDashboardRepository();
  const detail = await repo.getApplicationDetail(userId, appId, eventPage);

  if (!detail) {
    notFound();
  }

  return (
    <ApplicationDetailView
      detail={detail}
      appId={appId}
      eventPage={eventPage}
    />
  );
}
