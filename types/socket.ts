import { Action } from "./playerActions";

/// BASE TYPES ///
export enum PayloadType {
  None = 0,
  UpdatePlayer = 1,
  UpdateQueue = 2,
  UpdateTrack = 4,
  UpdateActions = 8,
  Initialize = 16,
}

export type Payload = {
  Type: PayloadType;
  CurrentTrack?: Track;
  Queue?: Queue;
  State?: Player;
  Actions?: Action[];
  VoiceChannelName?: string;
  StartedAt?: number;
  ResumeSession?: PlayerResumeSession;
};

export type Track = {
  Id: string;
  Title: string;
  Author: string;
  Duration: number;
  Url: string | null;
  ArtworkUrl: string | null;
  RequestedBy: SocketUser | null;
  Lyrics?: Lyrics;
};

type Lyrics = {
  sourceName: string;
  provider: string;
  text: string | null;
  lines: LyricsLine[];
  plugin: object;
};

type LyricsLine = {
  timestamp: number;
  duration: number;
  line: string;
  plugin: object;
};

export type Queue = {
  Tracks: Track[];
  History: Track[];
};

export type Player = {
  State: PlayerState;
  TrackRepeatMode: TrackRepeatMode;
  Volume: number;
  Position: number;
  IsAutoPlayEnabled: boolean;
  Listeners: SocketUser[];
};

/// MISC ///

export type SearchResult = {
  Tracks: Track[];
  Playlist: PlaylistInfo | null;
};

export type PlaylistInfo = {
  Name: string;
  Url: string;
  ArtworkUrl: string;
  Author: string;
};

export type ActionResult = {
  success: boolean;
  error?: string;
  code?: number;
};

export type PlayerResumeSession = {
  ChannelName: string;
  CurrentTrack: Track;
  QueueLength: number;
  UpcomingFewTracks: Track[];
  Timestamp: number;
};

export type SocketUser = {
  Username: string;
  DisplayName: string;
  AvatarUrl: string | null;
};

export type SocketGuild = {
  Id: string;
  Name: string;
  IconUrl: string;
  CurrentTrack: Track | null;
  ConnectedVoiceChannel: string | null;
  ResumeSession: PlayerResumeSession | null;
};

/// ENUMS ///

export enum PlayerState {
  Destroyed,
  NotPlaying,
  Playing,
  Paused,
}

export enum TrackRepeatMode {
  None,
  Track,
  Queue,
}
