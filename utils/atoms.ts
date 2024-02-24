import { InitPlayerPayload } from "@/types/payloads";
import {
  Action,
  PlayerState,
  SocketUser,
  Track,
  TrackRepeatMode,
} from "@/types/socket";
import { atom } from "jotai";

// SOCKET
export const botTokenAtom = atom<string | null>(null);
export const initAtom = atom<InitPlayerPayload | null>(null);

// PLAYER
export const positionAtom = atom<number>(0);
export const trackRepeatModeAtom = atom<TrackRepeatMode | null>(null);
export const playerStateAtom = atom<PlayerState | null>(null);
export const isAutoPlayEnabledAtom = atom<boolean | null>(null);
export const actionsAtom = atom<Action[] | null>(null);
export const queueAtom = atom<Track[] | null>(null);
export const historyAtom = atom<Track[] | null>(null);
export const currentTrackAtom = atom<Track | null>(null);
export const listenersAtom = atom<SocketUser[] | null>(null);
export const volumeAtom = atom<number | null>(null);
export const channelNameAtom = atom<string | null>(
  (get) => get(initAtom)?.VoiceChannelName ?? null
);
