import { TrackRepeatMode } from "@/types/socket";
import { toTime } from "@/utils/helpers";
import { Text } from "@mantine/core";
import {
  Action,
  ActionType,
  AddPlaylistAction,
  AddTrackAction,
  ChangeVolumeAction,
  CycleRepeatModeAction,
  MoveTrackAction,
  PlayAction,
  QueueAction,
  QueueActionType,
  SeekAction,
  SkipAction,
} from "..";
import { Playlist } from "../../../components/Playlist/Playlist";
import { Track } from "../../../components/Track/Track";

const queueTitleDict: Record<QueueActionType, string> = {
  [QueueActionType.AddTrack]: "Added to queue",
  [QueueActionType.AddPlaylist]: "Added to queue",
  [QueueActionType.Clear]: "Queue cleared",
  [QueueActionType.Distinct]: "Removed duplicates",
  [QueueActionType.Reverse]: "Reversed queue",
  [QueueActionType.Shuffle]: "Shuffled queue",
  [QueueActionType.MoveTrack]: "Moved to #{1} from #{0}",
  [QueueActionType.RemoveTrack]: "Song removed",
};

const titleDict: Record<ActionType, string> = {
  [ActionType.Play]: "Started playing",
  [ActionType.Skip]: "Started playing",
  [ActionType.Rewind]: "Started playing (rew)",
  [ActionType.Pause]: "Paused playback",
  [ActionType.Resume]: "Resumed playback",
  [ActionType.VolumeUp]: "Volume set to {0}%",
  [ActionType.VolumeDown]: "Volume set to {0}%",
  [ActionType.Queue]: "Queue",
  [ActionType.ChangeLoopMode]: "Loop",
  [ActionType.Stop]: "Stopped playback",
  [ActionType.Seek]: "Seeked to {0}",
  [ActionType.ToggleAutoPlay]: "Autoplay toggled",
};

export function getTitle(action: Action): string {
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
        (action as ChangeVolumeAction).Volume.toString()
      );
    case ActionType.Seek:
      return titleDict[action.Type].replace(
        "{0}",
        toTime((action as SeekAction).Position)
      );
    case ActionType.ChangeLoopMode: {
      const mode = (action as CycleRepeatModeAction).TrackRepeatMode;
      if (mode === TrackRepeatMode.None) return "Looping disabled";
      if (mode === TrackRepeatMode.Track) return "Looping current track";
      if (mode === TrackRepeatMode.Queue) return "Looping queue";
    }
  }

  return titleDict[action.Type];
}

export function getImage(action: Action): string | undefined {
  switch (action.Type) {
    case ActionType.Queue: {
      const qAction = action as QueueAction;
      if (
        qAction.QueueActionType === QueueActionType.AddTrack ||
        qAction.QueueActionType === QueueActionType.RemoveTrack ||
        qAction.QueueActionType === QueueActionType.MoveTrack
      ) {
        return (qAction as AddTrackAction).Track.ArtworkUrl || undefined;
      }

      if (qAction.QueueActionType === QueueActionType.AddPlaylist) {
        const addPlaylistAction = qAction as AddPlaylistAction;
        return (
          addPlaylistAction.Playlist?.ArtworkUrl ||
          addPlaylistAction.Tracks[0]?.ArtworkUrl ||
          undefined
        );
      }

      return undefined;
    }
    case ActionType.Play:
    case ActionType.Skip:
    case ActionType.Rewind:
      return (action as PlayAction).Track.ArtworkUrl ?? undefined;
  }

  return undefined;
}

export function getChildren(action: Action): React.ReactNode {
  const qAction = action as QueueAction;

  if (qAction.QueueActionType === QueueActionType.AddPlaylist) {
    const data = qAction as AddPlaylistAction;
    return <Playlist playlist={data} transparent expandable />;
  }

  if (
    action.Type === ActionType.Play ||
    action.Type === ActionType.Rewind ||
    qAction.QueueActionType === QueueActionType.AddTrack ||
    qAction.QueueActionType === QueueActionType.RemoveTrack ||
    qAction.QueueActionType === QueueActionType.MoveTrack
  ) {
    const track = (action as PlayAction).Track;

    return <Track track={track} transparent hoverable mode="play" withAdd />;
  }

  if (action.Type === ActionType.Skip) {
    const skipPayload = action as SkipAction;
    const track = skipPayload.Track;
    const prevTrack = skipPayload.PreviousTrack;

    return (
      <>
        <Track track={track} transparent hoverable mode="play" withAdd />
        <Text c="white" size="1rem" fw={600} lh={1.4} lineClamp={1}>
          Skipped
        </Text>
        <Track track={prevTrack} transparent hoverable mode="play" withAdd />
      </>
    );
  }

  return null;
}

export function getItemSize(action: Action): number {
  switch (action.Type) {
    case ActionType.Queue:
      switch ((action as QueueAction).QueueActionType) {
        case QueueActionType.AddPlaylist:
        case QueueActionType.AddTrack:
        case QueueActionType.RemoveTrack:
          return 160;
        case QueueActionType.MoveTrack:
          return 160;
        default:
          return 100;
      }
    case ActionType.Play:
    case ActionType.Rewind:
      return 160;
    case ActionType.Skip:
      return 260;
    default:
      return 100;
  }
}
