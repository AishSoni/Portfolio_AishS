import Link from "next/link";
import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { EngagementFeedItem } from "@/lib/dashboard/types";
import { formatRelativeTime } from "@/utils/format";
import { EmptyState } from "./EmptyState";

interface EngagementFeedProps {
  items: EngagementFeedItem[];
  hasMore: boolean;
  nextPageHref?: string;
}

export function EngagementFeed({ items, hasMore, nextPageHref }: EngagementFeedProps) {
  return (
    <Column gap="16" fillWidth>
      <Heading variant="heading-strong-s">Engagement feed</Heading>
      {items.length === 0 ? (
        <EmptyState message="No recruiter-attributed views yet." />
      ) : (
        <Column gap="8">
          {items.map((item) => (
            <Flex key={item.eventId} gap="12" wrap>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {formatRelativeTime(item.occurredAt)}
              </Text>
              <Link href={`/dashboard/apps/${item.appId}`}>
                <Text variant="body-default-s">{item.appId}</Text>
              </Link>
              <Text variant="body-default-s">
                {item.contactName ?? "Unknown"} · {item.company}
              </Text>
              {item.resumeLabel && (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {item.resumeLabel}
                </Text>
              )}
            </Flex>
          ))}
        </Column>
      )}
      {hasMore && nextPageHref && (
        <Link href={nextPageHref}>
          <Text variant="label-strong-s">Load more</Text>
        </Link>
      )}
    </Column>
  );
}
