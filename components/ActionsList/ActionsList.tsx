"use client";

import {
  Card,
  Center,
  Stack,
  Text,
  Divider,
  Skeleton,
  Group,
  ScrollArea,
  Space,
} from "@mantine/core";
import {
  Action,
  ActionResult,
  ActionType,
  ChangeLoopModeAction,
  EnqueuePlaylistAction,
  EnqueueTrackAction,
  MoveTrackAction,
  PlayAction,
  QueueAction,
  QueueActionType,
  RepeatMode,
  SeekAction,
  SkipAction,
  TrackData,
  VolumeAction,
} from "@/types";
import { IconList, IconMoodSad } from "@tabler/icons-react";
import { ActionCard } from "../ActionCard/ActionCard";
import { toTime } from "@/utils/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Track } from "../Track/Track";
import { useAtomValue } from "jotai";
import { actionFetchAtom, actionsAtom } from "@/utils/atoms";

function getTitle(action: Action): string {
  switch (action.Type) {
    case ActionType.Queue: {
      const qAction = action as QueueAction;
      const qTitle = queueTitleDict[qAction.QueueActionType];

      if (qAction.QueueActionType === QueueActionType.MoveTrack) {
        const moveTrackAction = action as MoveTrackAction;
        return qTitle
          .replace("{0}", (moveTrackAction.From + 1).toString())
          .replace("{1}", (moveTrackAction.To + 1).toString());
      }

      return queueTitleDict[qAction.QueueActionType];
    }
    case ActionType.VolumeUp:
    case ActionType.VolumeDown:
      return titleDict[action.Type].replace(
        "{0}",
        (action as VolumeAction).Volume.toString()
      );
    case ActionType.Seek:
      return titleDict[action.Type].replace(
        "{0}",
        toTime((action as SeekAction).Position)
      );
    case ActionType.ChangeLoopMode: {
      const mode = (action as ChangeLoopModeAction).LoopMode;
      if (mode === RepeatMode.None) return "Looping disabled";
      if (mode === RepeatMode.Track) return "Looping current track";
      if (mode === RepeatMode.Queue) return "Looping queue";
    }
  }

  return titleDict[action.Type];
}

function getImage(action: Action): string | undefined {
  switch (action.Type) {
    case ActionType.Queue: {
      const qAction = action as QueueAction;
      if (
        qAction.QueueActionType === QueueActionType.AddTrack ||
        qAction.QueueActionType === QueueActionType.RemoveTrack ||
        qAction.QueueActionType === QueueActionType.MoveTrack
      ) {
        return (qAction as EnqueueTrackAction).Track.Thumbnail || undefined;
      }

      if (qAction.QueueActionType === QueueActionType.AddPlaylist) {
        return (
          (qAction as EnqueuePlaylistAction).Tracks[0].Thumbnail || undefined
        );
      }

      return undefined;
    }
    case ActionType.Play:
    case ActionType.Skip:
    case ActionType.Rewind:
      return (action as PlayAction).Track.Thumbnail ?? undefined;
  }

  return undefined;
}

function getChildren(
  action: Action,
  onPlay: (url: string) => Promise<ActionResult>
): React.ReactNode {
  const qAction = action as QueueAction;

  if (qAction.QueueActionType === QueueActionType.AddPlaylist) {
    const tracks = (qAction as EnqueuePlaylistAction).Tracks;
    return <ActionCardPlaylist tracks={tracks} onPlay={onPlay} />;
  }

  if (
    action.Type === ActionType.Play ||
    action.Type === ActionType.Rewind ||
    qAction.QueueActionType === QueueActionType.AddTrack ||
    qAction.QueueActionType === QueueActionType.RemoveTrack ||
    qAction.QueueActionType === QueueActionType.MoveTrack
  ) {
    const track = (action as PlayAction).Track;

    return <Track track={track} small transparent onPlay={onPlay} />;
  }

  if (action.Type === ActionType.Skip) {
    const track = (action as SkipAction).Track;
    const prevTrack = (action as SkipAction).PreviousTrack;

    return (
      <>
        <Track track={track} small transparent />
        <Text c="white" size="1rem" fw={600} lh={1.4} lineClamp={1}>
          Skipped
        </Text>
        <Track track={prevTrack} small transparent onPlay={onPlay} />
      </>
    );
  }

  return null;
}

function ActionCardPlaylist({
  tracks,
  onPlay,
}: {
  tracks: TrackData[];
  onPlay?: (url: string) => Promise<ActionResult>;
}) {
  return (
    <ScrollArea h={100} type="always">
      {tracks.map((track) => (
        <Track
          key={`${track.Identifier}.${Math.random()}`}
          track={track}
          small
          transparent
          onPlay={onPlay}
        />
      ))}
    </ScrollArea>
  );
}

const queueTitleDict: Record<QueueActionType, string> = {
  [QueueActionType.AddTrack]: "Song added",
  [QueueActionType.AddPlaylist]: "Playlist added",
  [QueueActionType.Clear]: "Queue cleared",
  [QueueActionType.Distinct]: "Removed duplicates",
  [QueueActionType.Reverse]: "Reversed queue",
  [QueueActionType.Shuffle]: "Shuffled queue",
  [QueueActionType.MoveTrack]: "Song moved from #{0} to #{1}",
  [QueueActionType.RemoveTrack]: "Song removed",
};

const titleDict: Record<ActionType, string> = {
  [ActionType.Play]: "Started playing",
  [ActionType.Skip]: "Started playing",
  [ActionType.Rewind]: "Started playing (rewind)",
  [ActionType.Pause]: "Paused playback",
  [ActionType.Resume]: "Resumed playback",
  [ActionType.VolumeUp]: "Volume set to {0}%",
  [ActionType.VolumeDown]: "Volume set to {0}%",
  [ActionType.Queue]: "Queue",
  [ActionType.ChangeLoopMode]: "Loop",
  [ActionType.Stop]: "Stopped playback",
  [ActionType.Seek]: "Seeked to {0}",
};

export function ActionsList() {
  const actions = useAtomValue(actionsAtom);
  const play = useAtomValue(actionFetchAtom).playTrack;
  const [parent] = useAutoAnimate();

  if (actions === null)
    return (
      <Card shadow="xl" style={{ height: "100%" }} pt="sm">
        <Group gap={10} align="center">
          <IconList />
          <Text fw={600}>Actions</Text>
        </Group>
        <Divider mt="sm" />
        <Stack gap={10} mt={10}>
          <Skeleton w="100%" h={140} />
          <Skeleton w="100%" h={60} />
          <Skeleton w="100%" h={140} />
          <Skeleton w="100%" h={60} />
        </Stack>
      </Card>
    );

  if (actions.length === 0)
    return (
      <Card shadow="md" style={{ height: "100%" }}>
        <Center h="100%">
          <Stack gap={0} align="center">
            <IconMoodSad size={100} />
            <Text fw={700} size="xl">
              No actions yet
            </Text>
            <Text fw={400} size="md">
              Start using the player and actions will show up here!
            </Text>
          </Stack>
        </Center>
      </Card>
    );

  return (
    <Card shadow="md" pt="sm">
      <Group gap={10} align="center">
        <IconList />
        <Text fw={600}>Actions</Text>
      </Group>
      <Divider mt="sm" />
      <ScrollArea h={483}>
        <ul ref={parent}>
          {actions.map((action) => (
            <li key={action.Timestamp}>
              <ActionCard
                title={getTitle(action)}
                bgImage={getImage(action)}
                user={action.User}
                timestampMs={action.Timestamp}
              >
                {getChildren(action, play)}
              </ActionCard>
              <Space h={10} />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  );
}
