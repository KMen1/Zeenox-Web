/// BASE TYPES ///
export type Track = {
  Id: string;
  Title: string;
  Author: string;
  Duration: number;
  Url: string | null;
  ArtworkUrl: string | null;
  RequestedBy: SocketUser | null;
  Lyrics?: string | null;
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

export type Action = {
  Type: ActionType;
  User: SocketUser;
  Message: string;
  Timestamp: number;
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
export enum PayloadType {
  InitPlayer,
  UpdatePlayer,
  UpdateQueue,
  UpdateTrack,
  AddAction,
  AddActions,
}

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
