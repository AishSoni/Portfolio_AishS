import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { ResumeLeaderboardRow } from "@/lib/dashboard/types";
import { EmptyState } from "./EmptyState";

interface ResumeLeaderboardProps {
  rows: ResumeLeaderboardRow[];
}

export function ResumeLeaderboard({ rows }: ResumeLeaderboardProps) {
  return (
    <Column gap="16" fillWidth>
      <Heading variant="heading-strong-s">Resume leaderboard</Heading>
      {rows.length === 0 ? (
        <EmptyState message="No resume outreach data yet." />
      ) : (
        <Column as="table" fillWidth>
          <Flex as="thead">
            <Text as="th" variant="label-strong-s" padding="8">Resume</Text>
            <Text as="th" variant="label-strong-s" padding="8">Links</Text>
            <Text as="th" variant="label-strong-s" padding="8">Views</Text>
            <Text as="th" variant="label-strong-s" padding="8">Recruiters</Text>
          </Flex>
          {rows.map((r) => (
            <Flex key={r.resumeId} as="tr" borderTop="neutral-medium">
              <Text as="td" variant="body-default-s" padding="8">
                {r.label} ({r.resumeId})
              </Text>
              <Text as="td" variant="body-default-s" padding="8">{r.linksIssued}</Text>
              <Text as="td" variant="body-default-s" padding="8">{r.views}</Text>
              <Text as="td" variant="body-default-s" padding="8">{r.uniqueRecruiters}</Text>
            </Flex>
          ))}
        </Column>
      )}
    </Column>
  );
}
