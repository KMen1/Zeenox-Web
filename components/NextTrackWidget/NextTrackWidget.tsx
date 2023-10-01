"use client";

import {
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import Image from "next/image";
import { useQueueData } from "../QueueProvider";

export function NextTrackWidget() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const track = useQueueData().Tracks[0];
  return track ? (
    <Card withBorder shadow="md">
      <Stack gap={6}>
        <Title order={6} lh={1}>
          Upcoming
        </Title>
        <Divider />
        <Group gap={5}>
          <Image
            src={track.Thumbnail ?? "/placeholder-album.png"}
            width={36}
            height={36}
            alt={track.Title}
            style={{ borderRadius: "0.15rem" }}
          />
          <Stack gap={8} w="70%">
            <Text size="sm" c={dark ? "white" : "black"} lh={1} lineClamp={1}>
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
