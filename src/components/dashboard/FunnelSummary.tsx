import { Column, Heading, Text } from "@once-ui-system/core";
import type { FunnelStats } from "@/lib/dashboard/types";
import { funnelPercent } from "@/utils/format";
import { FunnelChart } from "./FunnelChart";

interface FunnelSummaryProps {
  funnel: FunnelStats;
}

export function FunnelSummary({ funnel }: FunnelSummaryProps) {
  return (
    <Column gap="16" fillWidth>
      <Heading variant="heading-strong-s">Funnel</Heading>
      <FunnelChart funnel={funnel} />
      <Column gap="4">
        {(["applied", "emailed", "viewed", "responded"] as const).map((stage) => (
          <Text key={stage} variant="body-default-s">
            {stage}: {funnel[stage]}{" "}
            {funnel.applied > 0 && `(${funnelPercent(funnel[stage], funnel.applied)}%)`}
          </Text>
        ))}
      </Column>
    </Column>
  );
}
