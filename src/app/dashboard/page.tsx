import type { Metadata } from "next";
import { getDashboardRepository } from "@/lib/dashboard";
import { getMermUserId } from "@/utils/merm";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

interface DashboardPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const userId = getMermUserId();
  const repo = getDashboardRepository();
  const params = await searchParams;
  const feedPage = Math.max(0, parseInt(params.page ?? "0", 10) || 0);

  const [pipeline, funnel, leaderboard, today, feed] = await Promise.all([
    repo.getPipeline(userId),
    repo.getFunnel(userId),
    repo.getResumeLeaderboard(userId),
    repo.getTodayQueue(userId),
    repo.getEngagementFeed(userId, feedPage),
  ]);

  return (
    <DashboardOverview
      pipeline={pipeline}
      funnel={funnel}
      leaderboard={leaderboard}
      today={today}
      feed={feed}
      feedPage={feedPage}
    />
  );
}
