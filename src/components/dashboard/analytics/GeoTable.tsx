import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { SiteGeoRow } from "@/lib/dashboard/types";
import { EmptyState } from "../EmptyState";

interface GeoTableProps {
  rows: SiteGeoRow[];
}

export function GeoTable({ rows }: GeoTableProps) {
  return (
    <Column gap="12" fillWidth>
      <Heading variant="heading-strong-s">Geo</Heading>
      {rows.length === 0 ? (
        <EmptyState message="No geo data yet." />
      ) : (
        <Column as="table" fillWidth style={{ borderCollapse: "collapse" }}>
          <Flex as="thead">
            <Text as="th" variant="label-strong-s" padding="8">Country</Text>
            <Text as="th" variant="label-strong-s" padding="8">Events</Text>
            <Text as="th" variant="label-strong-s" padding="8">Sessions</Text>
          </Flex>
          <Column as="tbody">
            {rows.map((row) => (
              <Flex key={row.country} as="tr" borderTop="neutral-medium">
                <Text as="td" variant="body-default-s" padding="8">{row.country}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.events}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.uniqueSessions}</Text>
              </Flex>
            ))}
          </Column>
        </Column>
      )}
    </Column>
  );
}
