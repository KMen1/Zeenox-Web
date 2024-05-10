import { PlaylistInfo, SocketUser, Track, TrackRepeatMode } from "./socket";

export enum ActionType {
  Play,
  Rewind,
  Pause,
  Resume,
  Skip,
  SkipTo,
  Stop,
  Seek,
  VolumeUp,
  VolumeDown,
  ChangeLoopMode,
  ToggleAutoPlay,
  AddTrack,
  AddPlaylist,
  MoveTrack,
  RemoveTrack,
  ClearQueue,
  DistinctQueue,
  ReverseQueue,
  ShuffleQueue,
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

export type AddPlaylistAction = {
  Playlist: PlaylistInfo;
  Tracks: Track[];
} & Action;

export type AddTrackAction = {
  Track: Track;
} & Action;

export type RemoveTrackAction = {
  Track: Track;
} & Action;

export type MoveTrackAction = {
  Track: Track;
  From: number;
  To: number;
} & Action;
