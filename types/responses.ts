import { Action } from "@/types/playerActions";
import { Player, PlayerResumeSession, Queue, Track } from "@/types/socket";

export type SessionDataResponse = {
  State: Player;
  Queue: Queue;
  CurrentTrack: Track;
  Actions: Action[];
};

export type PlayerResponse = {
  VoiceChannelName: string;
  StartedAt: number;
  Position: number;
  Player: Player;
  CurrentTrack: Track | null;
  Queue: Queue;
  ResumeSession: PlayerResumeSession | null;
  Actions: Action[];
};

export type PlayerStateResponse = {} & Player;
export type CurrentTrackResponse = {} & Track;
export type QueueResponse = {} & Queue;
export type ActionsResponse = {} & Action[];
