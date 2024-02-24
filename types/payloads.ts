import {
  Action,
  PayloadType,
  Player,
  PlayerResumeSession,
  Queue,
  Track,
} from "./socket";

export type Payload = {
  Type: PayloadType;
};

export type InitPlayerPayload = {
  VoiceChannelName: string;
  StartedAt: number;
  Position: number;
  Player: Player;
  CurrentTrack: Track | null;
  Queue: Queue;
  Actions: Action[];
  ResumeSession: PlayerResumeSession | null;
} & Payload;

export type UpdatePlayerPayload = {
  Player: Player;
} & Payload;

export type UpdateTrackPayload = {
  Track: Track | null;
} & Payload;

export type UpdateQueuePayload = {
  Queue: Queue;
} & Payload;

export type AddActionPayload = {
  Action: Action;
} & Payload;

export type AddActionsPayload = {
  Actions: Action[];
} & Payload;
