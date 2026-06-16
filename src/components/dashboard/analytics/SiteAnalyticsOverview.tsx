import { Column, Heading } from "@once-ui-system/core";
import type { SiteAnalyticsData } from "@/lib/dashboard/types";
import { DeviceBreakdown } from "./DeviceBreakdown";
import { GeoTable } from "./GeoTable";
import { ReferrersTable } from "./ReferrersTable";
import { SiteSummaryCards } from "./SiteSummaryCards";
import { SiteTimeseriesChart } from "./SiteTimeseriesChart";
import { TopPagesTable } from "./TopPagesTable";

interface SiteAnalyticsOverviewProps {
  data: SiteAnalyticsData;
}

export function SiteAnalyticsOverview({ data }: SiteAnalyticsOverviewProps) {
  const hasData =
    data.summary.pageViews > 0 ||
    data.summary.linkClicks > 0 ||
    data.summary.uniqueSessions > 0;

  return (
    <Column gap="40" fillWidth>
      <Heading variant="heading-strong-l">Site analytics</Heading>
      {hasData ? (
        <>
          <SiteSummaryCards summary={data.summary} />
          <SiteTimeseriesChart points={data.timeseries} />
          <TopPagesTable rows={data.topPages} />
          <ReferrersTable rows={data.referrers} />
          <DeviceBreakdown rows={data.devices} />
          <GeoTable rows={data.geo} />
        </>
      ) : (
        <TopPagesTable rows={[]} />
      )}
    </Column>
  );
}
