"use client";

import { Card, Group, Text } from "@mantine/core";
import { useChannelInfo } from "../Providers/ChannelInfoProvider";
import TimeAgo from "react-timeago";
import ListenersTooltip from "../ListenersTooltip/ListenersTooltip";
import { useInitData } from "../Providers/InitDataProvider";

export function PlayerLayoutStatusBar() {
  const { initData } = useInitData();
  const startedAt = initData?.StartedAt || 0;
  const { Name, Listeners } = useChannelInfo();
  const time = new Date(startedAt * 1000);
  const isAlone = Listeners.length === 1;

  const title = isAlone
    ? "You have been listening alone in channel"
    : `You have been listening with ${Listeners.length - 1} other person${
        Listeners.length > 2 ? "s" : ""
      } in channel `;

  return (
    <Card shadow="md">
      <Group justify="space-between">
        <Group gap={5}>
          <Text fw={600}>{title}</Text>
          <Text fw={800}>🔊 {Name}</Text>
          <Text fw={600}>
            for{" "}
            <TimeAgo
              date={time}
              formatter={(value, unit) => {
                return `${value} ${unit}${value > 1 ? "s" : ""}`;
              }}
            />
          </Text>
        </Group>

        <ListenersTooltip />
      </Group>
    </Card>
  );
}
