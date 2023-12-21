import {
  Action,
  DiscordUserData,
  InitData,
  PlayerState,
  RepeatMode,
  TrackData,
} from "@/types";
import { atom } from "jotai";

const fetchAtom = atom((get) => {
  const serverSessionToken = get(serverSessionTokenAtom);
  if (!serverSessionToken) {
    return {
      fn: async () => {
        return { success: false, error: "No session token" };
      },
    };
  }

  return {
    fn: async (method: string, params?: string, options?: RequestInit) => {
      const res = await fetch(
        `/api/player/${method}?token=${serverSessionToken}${
          params ? `&${params}` : ""
        }`,
        { method: "POST", ...options }
      );
      if (res.ok) {
        return { success: true };
      } else {
        const data = await res.text();
        return { success: false, error: data };
      }
    },
  };
});
export const actionFetchAtom = atom((get) => {
  const fetch = get(fetchAtom).fn;

  return {
    playTrack: async (url: string) => {
      return fetch(`playTrack`, `url=${url}`);
    },
    pause: async () => {
      return fetch(`pause`);
    },
    resume: async () => {
      return fetch(`resume`);
    },
    skipTrack: async () => {
      return fetch(`skipTrack`);
    },
    backTrack: async () => {
      return fetch(`backTrack`);
    },
    seekTrack: async (position: number) => {
      return fetch(`seekTrack`, `position=${position}`);
    },
    setVolume: async (volume: number) => {
      return fetch(`setVolume`, `volume=${volume}`);
    },
    addTrack: async (url: string) => {
      return fetch(`addTrack`, `url=${url}`);
    },
    removeTrack: async (index: number) => {
      return fetch(`removeTrack`, `index=${index}`);
    },
    clearQueue: async () => {
      return fetch(`clearQueue`);
    },
    shuffleQueue: async () => {
      return fetch(`shuffleQueue`);
    },
    distinctQueue: async () => {
      return fetch(`distinctQueue`);
    },
    reverseQueue: async () => {
      return fetch(`reverseQueue`);
    },
    skipToTrack: async (index: number) => {
      return fetch(`skipToTrack`, `index=${index}`);
    },
    moveTrack: async (from: number, to: number) => {
      return fetch(`moveTrack`, `from=${from}&to=${to}`);
    },
    cycleRepeatMode: async () => {
      return fetch(`cycleRepeatMode`);
    },
  };
});
export const serverSessionTokenAtom = atom<string | null>(null);
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
