import { Column, Flex, Text } from "@once-ui-system/core";
import type { PipelineRow } from "@/lib/dashboard/types";
import { formatExpiryCountdown } from "@/utils/format";
import { EmptyState } from "./EmptyState";
import { PipelineChart } from "./PipelineChart";

interface PipelineTableProps {
  rows: PipelineRow[];
}

export function PipelineTable({ rows }: PipelineTableProps) {
  if (rows.length === 0) {
    return <EmptyState message="No applications in the pipeline yet." />;
  }

  return (
    <Column gap="16" fillWidth>
      <PipelineChart data={rows} />
      <Column as="table" fillWidth style={{ borderCollapse: "collapse" }}>
        <Flex as="thead">
          <Text as="th" variant="label-strong-s" padding="8">Status</Text>
          <Text as="th" variant="label-strong-s" padding="8">Count</Text>
          <Text as="th" variant="label-strong-s" padding="8">Expiry</Text>
        </Flex>
        <Column as="tbody">
          {rows.map((row) => {
            const countdown = formatExpiryCountdown(row.earliestExpiry);
            const expiryLabel =
              countdown && row.status !== "active" && row.status !== "offer"
                ? `${row.status} · ${countdown}`
                : countdown ?? "—";
            return (
              <Flex key={row.status} as="tr" borderTop="neutral-medium">
                <Text as="td" variant="body-default-s" padding="8">{row.status}</Text>
                <Text as="td" variant="body-default-s" padding="8">{row.count}</Text>
                <Text as="td" variant="body-default-s" padding="8">{expiryLabel}</Text>
              </Flex>
            );
          })}
        </Column>
      </Column>
    </Column>
  );
}
