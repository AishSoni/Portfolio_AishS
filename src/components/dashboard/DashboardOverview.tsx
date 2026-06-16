import { Column, Heading } from "@once-ui-system/core";
import type {
  EngagementFeedItem,
  FunnelStats,
  PipelineRow,
  ResumeLeaderboardRow,
  TodayQueue,
} from "@/lib/dashboard/types";
import { EngagementFeed } from "./EngagementFeed";
import { FunnelSummary } from "./FunnelSummary";
import { PipelineTable } from "./PipelineTable";
import { ResumeLeaderboard } from "./ResumeLeaderboard";
import { TodayPanel } from "./TodayPanel";

interface DashboardOverviewProps {
  pipeline: PipelineRow[];
  funnel: FunnelStats;
  leaderboard: ResumeLeaderboardRow[];
  today: TodayQueue;
  feed: { items: EngagementFeedItem[]; hasMore: boolean };
  feedPage: number;
}

export function DashboardOverview({
  pipeline,
  funnel,
  leaderboard,
  today,
  feed,
  feedPage,
}: DashboardOverviewProps) {
  const nextPageHref = feed.hasMore
    ? `/dashboard?page=${feedPage + 1}`
    : undefined;

  return (
    <Column gap="40" fillWidth maxWidth="l">
      <Heading variant="heading-strong-l">MERM Dashboard</Heading>
      <PipelineTable rows={pipeline} />
      <TodayPanel today={today} />
      <FunnelSummary funnel={funnel} />
      <ResumeLeaderboard rows={leaderboard} />
      <EngagementFeed
        items={feed.items}
        hasMore={feed.hasMore}
        nextPageHref={nextPageHref}
      />
    </Column>
  );
}
