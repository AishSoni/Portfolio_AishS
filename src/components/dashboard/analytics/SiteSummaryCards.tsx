import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { SiteAnalyticsSummary } from "@/lib/dashboard/types";

interface SiteSummaryCardsProps {
  summary: SiteAnalyticsSummary;
}

export function SiteSummaryCards({ summary }: SiteSummaryCardsProps) {
  const cards = [
    { label: "Page views", value: summary.pageViews },
    { label: "Link clicks", value: summary.linkClicks },
    { label: "Unique sessions", value: summary.uniqueSessions },
  ];

  return (
    <Flex gap="16" wrap fillWidth>
      {cards.map((card) => (
        <Column
          key={card.label}
          padding="16"
          gap="4"
          border="neutral-medium"
          radius="m"
          style={{ minWidth: "140px", flex: "1 1 140px" }}
        >
          <Text variant="label-default-s" onBackground="neutral-weak">
            {card.label}
          </Text>
          <Heading variant="heading-strong-m">{card.value}</Heading>
        </Column>
      ))}
    </Flex>
  );
}
