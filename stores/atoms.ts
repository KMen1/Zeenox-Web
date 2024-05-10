import { Action } from "@/types/playerActions";
import {
  PlayerResumeSession,
  PlayerState,
  SocketUser,
  Track,
  TrackRepeatMode,
} from "@/types/socket";
import { atom } from "jotai";

// SOCKET
export const botTokenAtom = atom<string | null>(null);

// PLAYER
export const serverPositionAtom = atom<number>(0);
export const localPositionAtom = atom<number>(0);
export const trackRepeatModeAtom = atom<TrackRepeatMode | null>(null);
export const playerStateAtom = atom<PlayerState | null>(null);
export const isAutoPlayEnabledAtom = atom<boolean | null>(null);
export const actionsAtom = atom<Action[] | null>(null);
export const queueAtom = atom<Track[] | null>(null);
export const historyAtom = atom<Track[] | null>(null);
export const currentTrackAtom = atom<Track | null>(null);
export const listenersAtom = atom<SocketUser[] | null>(null);
export const volumeAtom = atom<number | null>(null);
export const channelNameAtom = atom<string | null>(null);
export const startedAtAtom = atom<number | null>(null);
export const resumeSessionAtom = atom<PlayerResumeSession | null>(null);
export const trackColorAtom = atom<string>("black");
export const selectedAtom = atom<"lyrics" | "actions">("lyrics");
