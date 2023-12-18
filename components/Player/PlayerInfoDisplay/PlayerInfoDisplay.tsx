"use client";

import ListenersTooltip from "@/components/ListenersTooltip/ListenersTooltip";
import { channelNameAtom, initAtom, requesterAtom } from "@/utils/atoms";
import { Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";
import Timeago from "react-timeago";

export function PlayerInfoDisplay() {
  const channelName = useAtomValue(channelNameAtom);
  const initData = useAtomValue(initAtom);
  const requestedBy = useAtomValue(requesterAtom);
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
