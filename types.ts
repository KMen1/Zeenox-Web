export type ServerMessage = {
  Player: PlayerData;
  Track: TrackData;
  Queue: QueueData;
};

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

export type PlayerData = {
  ShouldUpdate: boolean;
  State: PlayerState;
  RepeatMode: RepeatMode;
  Volume: number;
  Position: number | null;
  Listeners: DiscordUserData[];
};

export type QueueData = {
  ShouldUpdate: boolean;
  Tracks: TrackData[];
};

export type TrackData = {
  ShouldUpdate: boolean;
  Title: string;
  Author: string;
  Url: string | null;
  Thumbnail: string | null;
  Duration: number;
  RequestedBy: DiscordUserData;
};

export type DiscordUserData = {
  Username: string;
  DisplayName: string;
  AvatarUrl: string | null;
};
export enum ActionType {
  UPDATEPLAYER = "UPDATE_PLAYER",
  UPDATETRACK = "UPDATE_TRACK",
  UPDATEQUEUE = "UPDATE_QUEUE",
}
export type Action = {
  type: ActionType;
  payload: any;
};

export type GuildData = {
  Id: string;
  Name: string;
  IconUrl: string;
};
