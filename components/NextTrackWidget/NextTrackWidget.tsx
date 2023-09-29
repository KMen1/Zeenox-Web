"use client";

import { Card, Group, Stack, Text, useMantineColorScheme } from "@mantine/core";
import Image from "next/image";
import { useQueueData } from "../QueueProvider";

export function NextTrackWidget() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const track = useQueueData().Tracks[0];
  return track ? (
    <Card withBorder shadow="md">
      <Stack gap={6}>
        <Text>Coming up</Text>
        <Group gap="sm">
          <Image
            src={track.Thumbnail ?? "/placeholder-album.png"}
            width={36}
            height={36}
            alt={track.Title}
            style={{ borderRadius: "0.15rem" }}
          />
          <Stack gap={8}>
            <Text size="sm" color={dark ? "white" : "black"} lh={1}>
              {track.Title}
            </Text>
            <Text size="xs" lh={1}>
              {track.Author}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  ) : null;
}
