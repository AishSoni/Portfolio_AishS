import { Column, Text } from "@once-ui-system/core";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Column padding="16" horizontal="center">
      <Text variant="body-default-s" onBackground="neutral-weak">
        {message}
      </Text>
    </Column>
  );
}
