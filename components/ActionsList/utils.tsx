import {
  Action,
  ActionPayloadType,
  AddPlaylistPayload,
  AddTrackPayload,
  ChangeVolumePayload,
  CycleRepeatModePayload,
  MoveTrackPayload,
  PlayPayload,
  QueuePayload,
  QueuePayloadType,
  RepeatMode,
  SeekPayload,
  SkipPayload,
} from "@/types/socket";
import { toTime } from "@/utils/utils";
import { Track } from "../Track/Track";
import { Text } from "@mantine/core";
import { Playlist } from "../Playlist/Playlist";

const queueTitleDict: Record<QueuePayloadType, string> = {
  [QueuePayloadType.AddTrack]: "Song added",
  [QueuePayloadType.AddPlaylist]: "Playlist added",
  [QueuePayloadType.Clear]: "Queue cleared",
  [QueuePayloadType.Distinct]: "Removed duplicates",
  [QueuePayloadType.Reverse]: "Reversed queue",
  [QueuePayloadType.Shuffle]: "Shuffled queue",
  [QueuePayloadType.MoveTrack]: "Moved from {0} to {1}",
  [QueuePayloadType.RemoveTrack]: "Song removed",
};

const titleDict: Record<ActionPayloadType, string> = {
  [ActionPayloadType.Play]: "Started playing",
  [ActionPayloadType.Skip]: "Started playing",
  [ActionPayloadType.Rewind]: "Started playing (rewind)",
  [ActionPayloadType.Pause]: "Paused playback",
  [ActionPayloadType.Resume]: "Resumed playback",
  [ActionPayloadType.VolumeUp]: "Volume set to {0}%",
  [ActionPayloadType.VolumeDown]: "Volume set to {0}%",
  [ActionPayloadType.Queue]: "Queue",
  [ActionPayloadType.ChangeLoopMode]: "Loop",
  [ActionPayloadType.Stop]: "Stopped playback",
  [ActionPayloadType.Seek]: "Seeked to {0}",
};

export function getTitle(action: Action): string {
  switch (action.Type) {
    case ActionPayloadType.Queue: {
      const qAction = action as QueuePayload;
      const qTitle = queueTitleDict[qAction.QueueActionType];

      if (qAction.QueueActionType === QueuePayloadType.MoveTrack) {
        const moveTrackAction = action as MoveTrackPayload;
        return qTitle
          .replace("{0}", (moveTrackAction.From + 1).toString())
          .replace("{1}", (moveTrackAction.To + 1).toString());
      }

      return queueTitleDict[qAction.QueueActionType];
    }
    case ActionPayloadType.VolumeUp:
    case ActionPayloadType.VolumeDown:
      return titleDict[action.Type].replace(
        "{0}",
        (action as ChangeVolumePayload).Volume.toString()
      );
    case ActionPayloadType.Seek:
      return titleDict[action.Type].replace(
        "{0}",
        toTime((action as SeekPayload).Position)
      );
    case ActionPayloadType.ChangeLoopMode: {
      const mode = (action as CycleRepeatModePayload).LoopMode;
      if (mode === RepeatMode.None) return "Looping disabled";
      if (mode === RepeatMode.Track) return "Looping current track";
      if (mode === RepeatMode.Queue) return "Looping queue";
    }
  }

  return titleDict[action.Type];
}

export function getImage(action: Action): string | undefined {
  switch (action.Type) {
    case ActionPayloadType.Queue: {
      const qAction = action as QueuePayload;
      if (
        qAction.QueueActionType === QueuePayloadType.AddTrack ||
        qAction.QueueActionType === QueuePayloadType.RemoveTrack ||
        qAction.QueueActionType === QueuePayloadType.MoveTrack
      ) {
        return (qAction as AddTrackPayload).Track.Thumbnail || undefined;
      }

      if (qAction.QueueActionType === QueuePayloadType.AddPlaylist) {
        const addPlaylistAction = qAction as AddPlaylistPayload;
        return addPlaylistAction.ArtworkUrl
          ? addPlaylistAction.ArtworkUrl
          : addPlaylistAction.Tracks[0]?.Thumbnail || undefined;
      }

      return undefined;
    }
    case ActionPayloadType.Play:
    case ActionPayloadType.Skip:
    case ActionPayloadType.Rewind:
      return (action as PlayPayload).Track.Thumbnail ?? undefined;
  }

  return undefined;
}

export function getChildren(action: Action): React.ReactNode {
  const qAction = action as QueuePayload;

  if (qAction.QueueActionType === QueuePayloadType.AddPlaylist) {
    const data = qAction as AddPlaylistPayload;
    return <Playlist playlist={data} transparent expandable />;
  }

  if (
    action.Type === ActionPayloadType.Play ||
    action.Type === ActionPayloadType.Rewind ||
    qAction.QueueActionType === QueuePayloadType.AddTrack ||
    qAction.QueueActionType === QueuePayloadType.RemoveTrack ||
    qAction.QueueActionType === QueuePayloadType.MoveTrack
  ) {
    const track = (action as PlayPayload).Track;

    return (
      <Track track={track} small transparent hoverable withControls withPlay />
    );
  }

  if (action.Type === ActionPayloadType.Skip) {
    const skipPayload = action as SkipPayload;
    const track = skipPayload.Track;
    const prevTrack = skipPayload.PreviousTrack;

    return (
      <>
        <Track
          track={track}
          small
          transparent
          hoverable
          withControls
          withPlay
        />
        <Text c="white" size="1rem" fw={600} lh={1.4} lineClamp={1}>
          Skipped
        </Text>
        <Track
          track={prevTrack}
          small
          transparent
          hoverable
          withControls
          withPlay
        />
      </>
    );
  }

  return null;
}

export function getItemSize(action: Action): number {
  switch (action.Type) {
    case ActionPayloadType.Queue:
      switch ((action as QueuePayload).QueueActionType) {
        case QueuePayloadType.AddPlaylist:
        case QueuePayloadType.AddTrack:
        case QueuePayloadType.RemoveTrack:
          return 160;
        case QueuePayloadType.MoveTrack:
          return 160;
        default:
          return 100;
      }
    case ActionPayloadType.Play:
    case ActionPayloadType.Rewind:
      return 160;
    case ActionPayloadType.Skip:
      return 260;
    default:
      return 100;
  }
}
