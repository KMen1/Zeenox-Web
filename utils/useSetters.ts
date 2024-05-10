import {
  actionsAtom,
  channelNameAtom,
  currentTrackAtom,
  historyAtom,
  isAutoPlayEnabledAtom,
  listenersAtom,
  playerStateAtom,
  queueAtom,
  resumeSessionAtom,
  serverPositionAtom,
  startedAtAtom,
  trackRepeatModeAtom,
  volumeAtom,
} from "@/stores/atoms";
import { useSetAtom } from "jotai";

export function useSetters() {
  const setQueue = useSetAtom(queueAtom);
  const setHistory = useSetAtom(historyAtom);
  const setTrack = useSetAtom(currentTrackAtom);
  const setActions = useSetAtom(actionsAtom);
  const setVolume = useSetAtom(volumeAtom);
  const setRepeat = useSetAtom(trackRepeatModeAtom);
  const setPosition = useSetAtom(serverPositionAtom);
  const setState = useSetAtom(playerStateAtom);
  const setListeners = useSetAtom(listenersAtom);
  const setAutoPlay = useSetAtom(isAutoPlayEnabledAtom);
  const setResumeSession = useSetAtom(resumeSessionAtom);
  const setStartedAt = useSetAtom(startedAtAtom);
  const setChannelName = useSetAtom(channelNameAtom);

  return {
    setQueue,
    setHistory,
    setTrack,
    setActions,
    setVolume,
    setRepeat,
    setPosition,
    setState,
    setListeners,
    setAutoPlay,
    setResumeSession,
    setStartedAt,
    setChannelName,
  };
}
