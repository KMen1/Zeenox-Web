import {
  PlaylistInfo,
  SocketUser,
  Track,
  TrackRepeatMode,
} from "../../../types/socket";

export enum QueueActionType {
  AddTrack,
  AddPlaylist,
  Clear,
  Distinct,
  Reverse,
  Shuffle,
  MoveTrack,
  RemoveTrack,
}

export enum ActionType {
  Play,
  Queue,
  Rewind,
  Pause,
  Resume,
  Skip,
  Stop,
  Seek,
  VolumeUp,
  VolumeDown,
  ChangeLoopMode,
  ToggleAutoPlay,
}

export type Action = {
  Type: ActionType;
  User: SocketUser;
  Message: string;
  Timestamp: number;
};

export type SeekAction = {
  Position: number;
} & Action;

export type CycleRepeatModeAction = {
  TrackRepeatMode: TrackRepeatMode;
} & Action;

export type ChangeVolumeAction = {
  Volume: number;
} & Action;

export type SkipAction = {
  PreviousTrack: Track;
  Track: Track;
} & Action;

export type PlayAction = {
  Track: Track;
} & Action;

export type QueueAction = {
  QueueActionType: QueueActionType;
} & Action;

export type AddPlaylistAction = {
  Playlist: PlaylistInfo;
  Tracks: Track[];
} & QueueAction;

export type AddTrackAction = {
  Track: Track;
} & QueueAction;

export type RemoveTrackAction = {
  Track: Track;
} & QueueAction;

export type MoveTrackAction = {
  Track: Track;
  From: number;
  To: number;
} & QueueAction;
