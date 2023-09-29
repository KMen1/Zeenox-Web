"use client";

import { Flex, Group, Text, Avatar } from "@mantine/core";
import { useCurrentTrack } from "../CurrentTrackProvider";

export default function PlayerWidgetRequester() {
  const requestedBy = useCurrentTrack().RequestedBy;

  return (
    <Flex align="center" gap={5}>
      <Avatar
        src={requestedBy.AvatarUrl}
        alt={requestedBy.Username}
        radius="xl"
        size="sm"
      />
      <Group gap={2}>
        <Text size="10" c="white" lh={1} fw={400}>
          Added By
        </Text>
        <Text size="10" c="white" lh={1} fw={500}>
          {requestedBy.DisplayName}
        </Text>
        <Text size="10" c="dimmed" lh={1} fw={400}>
          ({requestedBy.Username})
        </Text>
      </Group>
    </Flex>
  );
}
