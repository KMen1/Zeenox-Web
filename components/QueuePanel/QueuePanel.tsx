"use client";

import { botTokenAtom, queueAtom } from "@/utils/atoms";
import { Center, Stack, Text } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { DndTrackList } from "../DndTrackList/DndTrackList";
import { TrackSkeleton } from "../Track/TrackSkeleton";
import { moveTrack } from "../actions";
import { useSize } from "../useSize";
import { withNotification } from "../withNotification";
import { QueuePanelMenu } from "./QueuePanelMenu";

export function QueuePanel() {
  const token = useAtomValue(botTokenAtom);
  const tracks = useAtomValue(queueAtom);
  const windowSize = useSize();
  const height = windowSize[1] - 357;
  const SKELETON_COUNT = Math.floor(height / 50) - 2;

  return (
    <Stack gap="xs">
      <QueuePanelMenu disabled={tracks?.length == 0} />
      {tracks === null &&
        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <TrackSkeleton key={i} />
        ))}
      {tracks !== null && tracks.length == 0 && (
        <Center h={height} p="xl">
          <Stack gap={0} align="center">
            <IconMoodSad size={100} />
            <Text fw={700} size="xl">
              Nothing here
            </Text>
            <Text fw={400} size="md" ta="center">
              Start adding songs and they will show up here!
            </Text>
          </Stack>
        </Center>
      )}
      {tracks !== null && tracks.length > 0 && (
        <DndTrackList
          baseTracks={tracks}
          onMove={async (from, to) => {
            withNotification(await moveTrack(from, to, token));
          }}
          height={height}
        />
      )}
    </Stack>
  );
}
