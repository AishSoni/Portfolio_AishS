import type {
  ApplicationDetail,
  EngagementFeedPage,
  FunnelStats,
  PipelineRow,
  ResumeLeaderboardRow,
  SiteAnalyticsSummary,
  SiteDeviceRow,
  SiteGeoRow,
  SiteReferrer,
  SiteTimeseriesPoint,
  SiteTopPage,
  TodayQueue,
} from "./types";

/** Read-only dashboard data access. */
export interface IDashboardRepository {
  /** Applications grouped by pipeline status. */
  getPipeline(userId: string): Promise<PipelineRow[]>;
  /** Outreach funnel conversion counts. */
  getFunnel(userId: string): Promise<FunnelStats>;
  getResumeLeaderboard(userId: string): Promise<ResumeLeaderboardRow[]>;
  getEngagementFeed(userId: string, page: number): Promise<EngagementFeedPage>;
  /** Mirror of Telegram /today queue (read-only). */
  getTodayQueue(userId: string): Promise<TodayQueue>;
  getApplicationDetail(
    userId: string,
    appId: string,
    eventPage?: number
  ): Promise<ApplicationDetail | null>;
  getSiteAnalyticsSummary(userId: string): Promise<SiteAnalyticsSummary>;
  getSiteTopPages(userId: string, limit?: number): Promise<SiteTopPage[]>;
  getSiteReferrers(userId: string, limit?: number): Promise<SiteReferrer[]>;
  getSiteDevices(userId: string): Promise<SiteDeviceRow[]>;
  getSiteGeo(userId: string): Promise<SiteGeoRow[]>;
  getSiteTimeseries(userId: string, days?: number): Promise<SiteTimeseriesPoint[]>;
}
