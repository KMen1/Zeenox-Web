"use client";

import ListenersTooltip from "@/components/ListenersTooltip/ListenersTooltip";
import { initAtom, requesterAtom } from "@/utils/atoms";
import { Avatar, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";
import Timeago from "react-timeago";
import classes from "./PlayerInfoDisplay.module.css";

export function PlayerInfoDisplay() {
  const initData = useAtomValue(initAtom);
  const requestedBy = useAtomValue(requesterAtom);
  const startedAt = initData?.StartedAt || 0;
  const time = new Date(startedAt * 1000);

  if (initData === null) {
    return (
      <Stack gap={2}>
        <Group justify="space-between">
          <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
            Added By:
          </Text>
          <Skeleton width={12} height={12} radius="xl" />
        </Group>

        <Group justify="space-between">
          <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
            Listening with:
          </Text>
          <Group gap={4}>
            <Skeleton width={12} height={12} radius="xl" />
            <Skeleton width={12} height={12} radius="xl" />
            <Skeleton width={12} height={12} radius="xl" />
          </Group>
        </Group>

        <Group justify="space-between">
          <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
            Time Elapsed:
          </Text>
          <Skeleton width={70} height={12} radius="xl" />
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
          Added By:
        </Text>
        <Tooltip label={requestedBy?.DisplayName ?? "Unknown"}>
          <Avatar
            src={requestedBy?.AvatarUrl}
            alt={requestedBy?.Username ?? "Unknown"}
            radius="xl"
            size={12}
          />
        </Tooltip>
      </Group>

      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
          Listening with:
        </Text>
        <ListenersTooltip />
      </Group>

      <Group justify="space-between">
        <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
          Time Elapsed:
        </Text>
        <Text size="10" lh={1.4} lineClamp={1} className={classes.infoText}>
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
