import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { SiteDeviceRow } from "@/lib/dashboard/types";
import { EmptyState } from "../EmptyState";

interface DeviceBreakdownProps {
  rows: SiteDeviceRow[];
}

export function DeviceBreakdown({ rows }: DeviceBreakdownProps) {
  return (
    <Column gap="12" fillWidth>
      <Heading variant="heading-strong-s">Device / browser</Heading>
      {rows.length === 0 ? (
        <EmptyState message="No device data yet." />
      ) : (
        <Column as="table" fillWidth style={{ borderCollapse: "collapse" }}>
          <Flex as="thead">
            <Text as="th" variant="label-strong-s" padding="8">Device</Text>
            <Text as="th" variant="label-strong-s" padding="8">Browser</Text>
            <Text as="th" variant="label-strong-s" padding="8">Events</Text>
          </Flex>
          <Column as="tbody">
            {rows.map((row) => (
              <Flex
                key={`${row.device}-${row.browser}`}
                as="tr"
                borderTop="neutral-medium"
              >
                <Text as="td" variant="body-default-s" padding="8">{row.device}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.browser}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.events}</Text>
              </Flex>
            ))}
          </Column>
        </Column>
      )}
    </Column>
  );
}
