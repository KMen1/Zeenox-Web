import {
  Action,
  PlaylistInfo,
  QueueActionType,
  Track,
  TrackRepeatMode,
} from "./socket";

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
