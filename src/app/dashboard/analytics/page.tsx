import type { Metadata } from "next";
import { getDashboardRepository } from "@/lib/dashboard";
import { getMermUserId } from "@/utils/merm";
import { SiteAnalyticsOverview } from "@/components/dashboard/analytics/SiteAnalyticsOverview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site analytics",
  robots: { index: false, follow: false },
};

export default async function SiteAnalyticsPage() {
  const userId = getMermUserId();
  const repo = getDashboardRepository();

  const [summary, topPages, referrers, devices, geo, timeseries] =
    await Promise.all([
      repo.getSiteAnalyticsSummary(userId),
      repo.getSiteTopPages(userId),
      repo.getSiteReferrers(userId),
      repo.getSiteDevices(userId),
      repo.getSiteGeo(userId),
      repo.getSiteTimeseries(userId),
    ]);

  return (
    <SiteAnalyticsOverview
      data={{ summary, topPages, referrers, devices, geo, timeseries }}
    />
  );
}
