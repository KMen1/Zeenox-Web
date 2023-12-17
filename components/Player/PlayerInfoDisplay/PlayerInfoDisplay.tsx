"use client";

import ListenersTooltip from "@/components/ListenersTooltip/ListenersTooltip";
import { useCurrentTrack } from "@/components/Providers/CurrentTrackProvider";
import { useInitData } from "@/components/Providers/InitDataProvider";
import { Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import Timeago from "react-timeago";

export function PlayerInfoDisplay() {
  const { initData } = useInitData();
  const { track } = useCurrentTrack();
  const requestedBy = track?.RequestedBy;
  const channelName = initData?.VoiceChannelName ?? "Unknown";
  const startedAt = initData?.StartedAt || 0;
  const time = new Date(startedAt * 1000);
  return (
    <Stack gap={2}>
      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1}>
          Added By:
        </Text>
        <Tooltip label={requestedBy?.Username ?? "Unknown"}>
          <Avatar
            src={requestedBy?.AvatarUrl}
            alt={requestedBy?.Username ?? "Unknown"}
            radius="xl"
            size={12}
          />
        </Tooltip>
      </Group>

      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1}>
          In Channel: {channelName}
        </Text>
        <ListenersTooltip />
      </Group>

      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1}>
          Time Elapsed:
        </Text>
        <Text size="10" lh={1.4} lineClamp={1}>
          <Timeago
            date={time}
            formatter={(value, unit) => {
              return `${value} ${unit}${value > 1 ? "s" : ""}`;
            }}
          />
        </Text>
      </Group>
    </Stack>
  );
}
