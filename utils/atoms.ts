import {
  Action,
  DiscordUserData,
  InitData,
  PlayerState,
  RepeatMode,
  TrackData,
} from "@/types";
import { atom } from "jotai";

export const initAtom = atom<InitData | null>(null);
export const positionAtom = atom<number>(0);
export const repeatAtom = atom<RepeatMode | null>(null);
export const stateAtom = atom<PlayerState | null>(null);
export const actionsAtom = atom<Action[] | null>(null);
export const queueAtom = atom<TrackData[] | null>(null);
export const trackAtom = atom<TrackData | null>(null);
export const requesterAtom = atom<DiscordUserData | null>(
  (get) => get(trackAtom)?.RequestedBy ?? null
);
export const durationAtom = atom<number>(
  (get) => get(trackAtom)?.Duration ?? 0
);
export const channelNameAtom = atom<string | null>(
  (get) => get(initAtom)?.VoiceChannelName ?? null
);
export const listenersAtom = atom<DiscordUserData[] | null>(null);
export const volumeAtom = atom<number>(100);
