"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { botTokenAtom, queueAtom } from "@/stores/atoms";
import { Center, Stack, Text } from "@mantine/core";
import { IconMoodSad, IconPlaylist } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { DndTrackList } from "../../../components/DndTrackList/DndTrackList";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { useSize } from "../../../hooks/useSize";
import { moveTrack } from "../../../utils/actions";
import { withNotification } from "../../../utils/withNotification";
import { QueuePanelMenu } from "./QueuePanelMenu/QueuePanelMenu";

export function QueuePanel() {
  const token = useAtomValue(botTokenAtom);
  const tracks = useAtomValue(queueAtom);
  const windowSize = useSize();
  const height = windowSize[1] - 357;
  const SKELETON_COUNT = Math.floor(height / 50) + 1;

  return (
    <ContentCard title="Queue" icon={<IconPlaylist />}>
      <Stack gap="xs">
        <QueuePanelMenu disabled={tracks?.length == 0} />
        {tracks === null && (
          <Stack gap={0}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TrackSkeleton key={i} />
            ))}
          </Stack>
        )}
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
    </ContentCard>
  );
}
