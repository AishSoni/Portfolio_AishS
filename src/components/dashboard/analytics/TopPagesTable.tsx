import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { SiteTopPage } from "@/lib/dashboard/types";
import { EmptyState } from "../EmptyState";

interface TopPagesTableProps {
  rows: SiteTopPage[];
}

export function TopPagesTable({ rows }: TopPagesTableProps) {
  return (
    <Column gap="12" fillWidth>
      <Heading variant="heading-strong-s">Top pages</Heading>
      {rows.length === 0 ? (
        <EmptyState message="No page views recorded yet." />
      ) : (
        <Column as="table" fillWidth style={{ borderCollapse: "collapse" }}>
          <Flex as="thead">
            <Text as="th" variant="label-strong-s" padding="8">Path</Text>
            <Text as="th" variant="label-strong-s" padding="8">Views</Text>
            <Text as="th" variant="label-strong-s" padding="8">Sessions</Text>
          </Flex>
          <Column as="tbody">
            {rows.map((row) => (
              <Flex key={row.path} as="tr" borderTop="neutral-medium">
                <Text as="td" variant="body-default-s" padding="8">{row.path}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.views}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.uniqueSessions}</Text>
              </Flex>
            ))}
          </Column>
        </Column>
      )}
    </Column>
  );
}
