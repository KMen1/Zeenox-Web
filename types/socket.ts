/// ACTIONS ///
export type Action = {
  Type: ActionPayloadType;
  User: BasicDiscordUser;
  Message: string;
  Timestamp: number;
};

export type AddActionPayload = {
  Action: Action;
} & Payload;

export type AddActionsPayload = {
  Actions: Action[];
} & Payload;

export type SeekPayload = {
  Position: number;
} & Action;

export type CycleRepeatModePayload = {
  LoopMode: RepeatMode;
} & Action;

export type ChangeVolumePayload = {
  Volume: number;
} & Action;

export type SkipPayload = {
  PreviousTrack: Track;
  Track: Track;
} & Action;

export type PlayPayload = {
  Track: Track;
} & Action;

export type QueuePayload = {
  QueueActionType: QueuePayloadType;
} & Action;

export type AddPlaylistPayload = {
  Name: string | null;
  Url: string | null;
  ArtworkUrl: string | null;
  Author: string | null;
  Tracks: Track[];
} & QueuePayload;

export type AddTrackPayload = {
  Track: Track;
} & QueuePayload;

export type RemoveTrackPayload = {
  Track: Track;
} & QueuePayload;

export type MoveTrackPayload = {
  Track: Track;
  From: number;
  To: number;
} & QueuePayload;

/// EVENTS ///
export type Payload = {
  Type: PayloadType;
};

export type InitPayload = {
  VoiceChannelName: string;
  StartedAt: number;
  Position: number;
  ResumeSession: PlayerResumeSession | null;
} & Payload;

export type UpdatePlayerPayload = {
  State: PlayerState;
  RepeatMode: RepeatMode;
  Volume: number;
  Position: number | null;
  Listeners: BasicDiscordUser[];
} & Payload;

export type UpdateQueuePayload = {
  Tracks: Track[];
} & Payload;

/// MISC ///

export type Track = {
  Identifier: string;
  Title: string;
  Author: string;
  Url: string;
  Thumbnail: string | null;
  Duration: number;
  RequestedBy: BasicDiscordUser;
  Lyrics: string | null;
} & Payload;

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

export type BasicDiscordUser = {
  Username: string;
  DisplayName: string;
  AvatarUrl: string | null;
};

export type BasicDiscordGuild = {
  Id: string;
  Name: string;
  IconUrl: string;
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

export enum RepeatMode {
  None,
  Track,
  Queue,
}

export enum QueuePayloadType {
  AddTrack,
  AddPlaylist,
  Clear,
  Distinct,
  Reverse,
  Shuffle,
  MoveTrack,
  RemoveTrack,
}

export enum ActionPayloadType {
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
}
