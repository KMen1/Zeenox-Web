"use client";

import { Card, Divider, Group, Skeleton, Stack, Title } from "@mantine/core";
import { Track } from "../Track/Track";
import { useAtomValue } from "jotai";
import { actionFetchAtom, queueAtom } from "@/utils/atoms";

export default function NextTrack() {
  const tracks = useAtomValue(queueAtom);
  const track = tracks ? (tracks.length > 0 ? tracks[0] : undefined) : null;
  const { skipToTrack } = useAtomValue(actionFetchAtom);

  function skipTo(index: number) {
    if (track) {
      return skipToTrack(0);
    }

    return Promise.reject();
  }

  if (track === null)
    return (
      <Card>
        <Title order={5} lh={1}>
          Upcoming
        </Title>
        <Divider mt={10} />
        <Group gap={10} mt={10}>
          <Skeleton w={36} h={36} radius="md" />
          <Stack gap={10} w="70%">
            <Skeleton w={100} h={7} />
            <Skeleton w={75} h={7} />
          </Stack>
        </Group>
      </Card>
    );

  return (
    <Card shadow="xl">
      <Stack gap={8}>
        <Title order={5} lh={1}>
          Upcoming
        </Title>
        <Divider />
        <Track track={track!} small onSkipTo={skipTo} />
      </Stack>
    </Card>
  );
}
