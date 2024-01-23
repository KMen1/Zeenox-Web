"use client";

import {
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Track } from "../Track/Track";
import { useAtomValue } from "jotai";
import { actionFetchAtom, queueAtom } from "@/utils/atoms";
import { IconMoodSad, IconPlayerTrackNext } from "@tabler/icons-react";
import classes from "./NextTrack.module.css";

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
      <Card className={classes.nextTrackCard}>
        <Text lh={1}>Upcoming</Text>
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
    <Card shadow="xl" className={classes.nextTrackCard}>
      <Stack gap={8}>
        <Group gap={10} align="center">
          <IconPlayerTrackNext size={24} />
          <Text pb={3}>Upcoming</Text>
        </Group>
        <Divider />
        {track ? (
          <Track track={track} small hoverable withControls onSkipTo={skipTo} />
        ) : (
          <Group p="xs" wrap="nowrap">
            <Text>
              <IconMoodSad size={33} />
            </Text>

            <Text size="0.9rem">No upcoming tracks</Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
