"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { Center } from "@/components/ui/center";
import { botTokenAtom, queueAtom } from "@/stores/atoms";
import { IconMoodSad, IconPlaylist } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { DndTrackList } from "../../../components/DndTrackList/DndTrackList";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { moveTrack } from "../../../utils/actions";
import { withNotification } from "../../../utils/withNotification";
import { QueuePanelMenu } from "./QueuePanelMenu";

export function QueuePanel() {
  const token = useAtomValue(botTokenAtom);
  const tracks = useAtomValue(queueAtom);

  return (
    <ContentCard
      title="Queue"
      icon={<IconPlaylist />}
      className="[grid-area:queue]"
    >
      <div className="flex h-full flex-col gap-2">
        <QueuePanelMenu disabled={tracks?.length == 0} />
        {tracks === null && (
          <div className="flex flex-col">
            {Array.from({ length: 1 }).map((_, i) => (
              <TrackSkeleton key={i} />
            ))}
          </div>
        )}
        {tracks !== null && tracks.length == 0 && (
          <Center>
            <div className="flex flex-col items-center">
              <IconMoodSad size={100} />
              <p className="text-2xl font-bold">Nothing here</p>
              <p className="text-sm">
                Start adding songs and they will show up here!
              </p>
            </div>
          </Center>
        )}
        {tracks !== null && tracks.length > 0 && (
          <DndTrackList
            baseTracks={tracks}
            onMove={async (from, to) => {
              withNotification(await moveTrack(from, to, token));
            }}
          />
        )}
      </div>
    </ContentCard>
  );
}
