import Link from "next/link";
import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { ApplicationDetail } from "@/lib/dashboard/types";
import { formatExpiryCountdown } from "@/utils/format";
import { ApplicationTimeline } from "./ApplicationTimeline";

interface ApplicationDetailViewProps {
  detail: ApplicationDetail;
  appId: string;
  eventPage: number;
}

export function ApplicationDetailView({
  detail,
  appId,
  eventPage,
}: ApplicationDetailViewProps) {
  const { app } = detail;
  const expiry = formatExpiryCountdown(app.expiresAt);

  return (
    <Column gap="32" fillWidth maxWidth="l">
      <Link href="/dashboard">
        <Text variant="label-strong-s">← Dashboard</Text>
      </Link>

      <Column gap="8">
        <Heading variant="heading-strong-m">
          {app.companyName} · {app.role ?? "—"}
        </Heading>
        <Text variant="body-default-s">
          {app.appId} · {app.status}
          {expiry ? ` · ${expiry}` : ""}
        </Text>
      </Column>

      <Column gap="12">
        <Heading variant="heading-strong-s">Contacts</Heading>
        {detail.contacts.length === 0 ? (
          <Text variant="body-default-s" onBackground="neutral-weak">No contacts</Text>
        ) : (
          detail.contacts.map((c) => (
            <Text key={c.id} variant="body-default-s">
              {c.name ?? c.email} · {c.email}
            </Text>
          ))
        )}
      </Column>

      <Column gap="12">
        <Heading variant="heading-strong-s">Tracked links</Heading>
        {detail.links.length === 0 ? (
          <Text variant="body-default-s" onBackground="neutral-weak">No links</Text>
        ) : (
          detail.links.map((l, i) => (
            <Text key={i} variant="body-default-s">
              {l.resumeLabel} ({l.resumeId})
              {l.linkToken ? ` / ${l.linkToken}` : " (generic)"}
              {l.contactEmail ? ` → ${l.contactEmail}` : ""}
            </Text>
          ))
        )}
      </Column>

      <Column gap="12">
        <Heading variant="heading-strong-s">Follow-up sequence</Heading>
        {detail.followups.length === 0 ? (
          <Text variant="body-default-s" onBackground="neutral-weak">No sequence</Text>
        ) : (
          detail.followups.map((f) => (
            <Flex key={f.stepNumber} gap="8">
              <Text variant="body-default-s">Step {f.stepNumber}</Text>
              <Text variant="body-default-s">{f.state}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {f.templateRef ?? "—"}
              </Text>
            </Flex>
          ))
        )}
      </Column>

      <Column gap="12">
        <Heading variant="heading-strong-s">Event timeline</Heading>
        <ApplicationTimeline events={detail.events} />
        {detail.hasMoreEvents && (
          <Link href={`/dashboard/apps/${appId}?events=${eventPage + 1}`}>
            <Text variant="label-strong-s">Older events</Text>
          </Link>
        )}
        {eventPage > 0 && (
          <Link href={`/dashboard/apps/${appId}?events=${eventPage - 1}`}>
            <Text variant="label-strong-s">Newer events</Text>
          </Link>
        )}
      </Column>
    </Column>
  );
}
