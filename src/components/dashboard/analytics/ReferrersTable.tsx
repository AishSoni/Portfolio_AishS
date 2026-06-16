import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { SiteReferrer } from "@/lib/dashboard/types";
import { EmptyState } from "../EmptyState";

interface ReferrersTableProps {
  rows: SiteReferrer[];
}

export function ReferrersTable({ rows }: ReferrersTableProps) {
  return (
    <Column gap="12" fillWidth>
      <Heading variant="heading-strong-s">Referrers</Heading>
      {rows.length === 0 ? (
        <EmptyState message="No referrer data yet." />
      ) : (
        <Column as="table" fillWidth style={{ borderCollapse: "collapse" }}>
          <Flex as="thead">
            <Text as="th" variant="label-strong-s" padding="8">Referrer</Text>
            <Text as="th" variant="label-strong-s" padding="8">Views</Text>
            <Text as="th" variant="label-strong-s" padding="8">Sessions</Text>
          </Flex>
          <Column as="tbody">
            {rows.map((row) => (
              <Flex key={row.referrer} as="tr" borderTop="neutral-medium">
                <Text as="td" variant="body-default-s" padding="8">{row.referrer}</Text>
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
