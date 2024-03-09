"use client";

import { ListenersTooltip } from "@/components/ListenersTooltip/ListenersTooltip";
import { currentTrackAtom, startedAtAtom } from "@/stores/atoms";
import { Avatar, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";
import Timeago from "react-timeago";
import classes from "./PlayerInfoDisplay.module.css";

export function PlayerInfoDisplay() {
  const track = useAtomValue(currentTrackAtom);
  const startedAt = useAtomValue(startedAtAtom);
  const requestedBy = track?.RequestedBy;
  const time = new Date(startedAt || 0 * 1000);

  if (startedAt === null) {
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
