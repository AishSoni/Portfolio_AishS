import { Column, Flex, Text } from "@once-ui-system/core";
import type { ApplicationEvent } from "@/lib/dashboard/types";
import { formatRelativeTime } from "@/utils/format";
import { EmptyState } from "./EmptyState";

interface ApplicationTimelineProps {
  events: ApplicationEvent[];
}

export function ApplicationTimeline({ events }: ApplicationTimelineProps) {
  if (events.length === 0) {
    return <EmptyState message="No events recorded for this application." />;
  }

  return (
    <Column gap="8" fillWidth>
      {events.map((e) => (
        <Flex key={e.id} gap="12" wrap>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {formatRelativeTime(e.occurredAt)}
          </Text>
          <Text variant="body-default-s">{e.type}</Text>
          {e.contactName && (
            <Text variant="body-default-s">{e.contactName}</Text>
          )}
          {e.viewerClass && e.type === "resume_view" && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              ({e.viewerClass})
            </Text>
          )}
        </Flex>
      ))}
    </Column>
  );
}
