import Link from "next/link";
import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { TodayQueue } from "@/lib/dashboard/types";
import { EmptyState } from "./EmptyState";

interface TodayPanelProps {
  today: TodayQueue;
}

export function TodayPanel({ today }: TodayPanelProps) {
  const hasItems =
    today.bumps.length > 0 ||
    today.reactivations.length > 0 ||
    today.staleItems.length > 0;

  return (
    <Column gap="16" fillWidth>
      <Heading variant="heading-strong-s">Today</Heading>
      <Text variant="body-default-s" onBackground="neutral-weak">
        Read-only mirror — approve bumps in Telegram.
      </Text>
      <Text variant="label-strong-s">
        Apply target: {today.targetProgress.applied} / {today.targetProgress.target}
      </Text>
      {today.deferredCount > 0 && (
        <Text variant="body-default-s">
          {today.deferredCount} bump(s) deferred past today&apos;s cap
        </Text>
      )}
      {!hasItems && <EmptyState message="Nothing queued for today." />}
      {today.bumps.length > 0 && (
        <Column gap="8">
          <Text variant="label-strong-s">Bumps awaiting approval</Text>
          {today.bumps.map((b) => (
            <Flex key={b.followupId} gap="8">
              <Link href={`/dashboard/apps/${b.appId}`}>
                <Text variant="body-default-s">{b.appId}</Text>
              </Link>
              <Text variant="body-default-s">
                {b.company} · {b.role} · step {b.stepNumber}
              </Text>
            </Flex>
          ))}
        </Column>
      )}
      {today.reactivations.length > 0 && (
        <Column gap="8">
          <Text variant="label-strong-s">Eligible reactivations</Text>
          {today.reactivations.map((a) => (
            <Link key={a.appId} href={`/dashboard/apps/${a.appId}`}>
              <Text variant="body-default-s">
                {a.appId} · {a.company} · {a.role}
              </Text>
            </Link>
          ))}
        </Column>
      )}
      {today.staleItems.length > 0 && (
        <Column gap="8">
          <Text variant="label-strong-s">Stale checks</Text>
          {today.staleItems.map((a) => (
            <Link key={a.appId} href={`/dashboard/apps/${a.appId}`}>
              <Text variant="body-default-s">
                {a.appId} · {a.company} · {a.role}
              </Text>
            </Link>
          ))}
        </Column>
      )}
    </Column>
  );
}
