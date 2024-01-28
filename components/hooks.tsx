import { actionFetchAtom } from "@/utils/atoms";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { getErrorMessageFromCode } from "@/utils/utils";
import {
  IconArrowsShuffle,
  IconArrowsSort,
  IconCopyOff,
  IconDeviceFloppy,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerTrackNextFilled,
  IconPlaylistAdd,
  IconPlaylistX,
  IconRepeat,
  IconRotateClockwise,
  IconTrashX,
  IconVolume,
  IconX,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";

enum NotificationType {
  Play,
  Add,
  Pause,
  Resume,
  Skip,
  SkipTo,
  Back,
  Seek,
  Volume,
  Remove,
  Clear,
  Shuffle,
  Distinct,
  Reverse,
  Move,
  CycleRepeat,
  ResumeSession,
  SaveSession,
  Disconnect,
}

// dictionary of icons for each notification type
const icons: Record<NotificationType, JSX.Element> = {
  [NotificationType.Play]: <IconPlayerPlayFilled width="70%" height="70%" />,
  [NotificationType.Add]: <IconPlaylistAdd width="70%" height="70%" />,
  [NotificationType.Pause]: <IconPlayerPauseFilled width="70%" height="70%" />,
  [NotificationType.Resume]: <IconPlayerPlayFilled width="70%" height="70%" />,
  [NotificationType.Skip]: (
    <IconPlayerSkipForwardFilled width="70%" height="70%" />
  ),
  [NotificationType.SkipTo]: (
    <IconPlayerSkipForwardFilled width="70%" height="70%" />
  ),
  [NotificationType.Back]: (
    <IconPlayerSkipBackFilled width="70%" height="70%" />
  ),
  [NotificationType.Seek]: (
    <IconPlayerTrackNextFilled width="70%" height="70%" />
  ),
  [NotificationType.Volume]: <IconVolume width="70%" height="70%" />,
  [NotificationType.Remove]: <IconPlaylistX width="70%" height="70%" />,
  [NotificationType.Clear]: <IconTrashX width="70%" height="70%" />,
  [NotificationType.Shuffle]: <IconArrowsShuffle width="70%" height="70%" />,
  [NotificationType.Distinct]: <IconCopyOff width="70%" height="70%" />,
  [NotificationType.Reverse]: <IconRotateClockwise width="70%" height="70%" />,
  [NotificationType.Move]: <IconArrowsSort width="70%" height="70%" />,
  [NotificationType.CycleRepeat]: <IconRepeat width="70%" height="70%" />,
  [NotificationType.ResumeSession]: (
    <IconPlayerPlayFilled width="70%" height="70%" />
  ),
  [NotificationType.SaveSession]: <IconDeviceFloppy width="70%" height="70%" />,
  [NotificationType.Disconnect]: <IconX width="70%" height="70%" />,
};

const titleLoading: Record<NotificationType, string> = {
  [NotificationType.Play]: "Trying to play {0}...",
  [NotificationType.Add]: "Trying to add {0}...",
  [NotificationType.Pause]: "Trying to pause playback...",
  [NotificationType.Resume]: "Trying to resume playback...",
  [NotificationType.Skip]: "Trying to skip {0}...",
  [NotificationType.SkipTo]: "Trying to skip to {0}...",
  [NotificationType.Back]: "Trying to go back...",
  [NotificationType.Seek]: "Trying to seek...",
  [NotificationType.Volume]: "Trying to change volume to {0}%...",
  [NotificationType.Remove]: "Trying to remove {0}...",
  [NotificationType.Clear]: "Trying to clear queue...",
  [NotificationType.Shuffle]: "Trying to shuffle queue...",
  [NotificationType.Distinct]: "Trying to remove duplicates...",
  [NotificationType.Reverse]: "Trying to reverse queue...",
  [NotificationType.Move]: "Trying to move track...",
  [NotificationType.CycleRepeat]: "Trying to cycle repeat mode...",
  [NotificationType.ResumeSession]: "Trying to resume session...",
  [NotificationType.SaveSession]: "Trying to save session...",
  [NotificationType.Disconnect]: "Trying to disconnect...",
};

const titleSuccess: Record<NotificationType, string> = {
  [NotificationType.Play]: "Playing {0}",
  [NotificationType.Add]: "Added {0}",
  [NotificationType.Pause]: "Paused playback",
  [NotificationType.Resume]: "Resumed playback",
  [NotificationType.Skip]: "Skipped {0}",
  [NotificationType.SkipTo]: "Skipped to {0}",
  [NotificationType.Back]: "Went back",
  [NotificationType.Seek]: "Seeked",
  [NotificationType.Volume]: "Volume set to {0}%",
  [NotificationType.Remove]: "Removed {0}",
  [NotificationType.Clear]: "Cleared queue",
  [NotificationType.Shuffle]: "Shuffled queue",
  [NotificationType.Distinct]: "Removed duplicates",
  [NotificationType.Reverse]: "Reversed queue",
  [NotificationType.Move]: "Moved {0}",
  [NotificationType.CycleRepeat]: "Cycled repeat",
  [NotificationType.ResumeSession]: "Resumed session",
  [NotificationType.SaveSession]: "Saved session",
  [NotificationType.Disconnect]: "Disconnected",
};

const titleError: Record<NotificationType, string> = {
  [NotificationType.Play]: "Unable to play",
  [NotificationType.Add]: "Unable to add",
  [NotificationType.Pause]: "Unable to pause",
  [NotificationType.Resume]: "Unable to resume",
  [NotificationType.Skip]: "Unable to skip",
  [NotificationType.SkipTo]: "Unable to skip to",
  [NotificationType.Back]: "Unable to go back",
  [NotificationType.Seek]: "Unable to seek",
  [NotificationType.Volume]: "Unable to change volume",
  [NotificationType.Remove]: "Unable to remove",
  [NotificationType.Clear]: "Unable to clear",
  [NotificationType.Shuffle]: "Unable to shuffle",
  [NotificationType.Distinct]: "Unable to remove duplicates",
  [NotificationType.Reverse]: "Unable to reverse",
  [NotificationType.Move]: "Unable to move",
  [NotificationType.CycleRepeat]: "Unable to cycle repeat",
  [NotificationType.ResumeSession]: "Unable to resume session",
  [NotificationType.SaveSession]: "Unable to save session",
  [NotificationType.Disconnect]: "Unable to disconnect",
};

function useActions() {
  return useAtomValue(actionFetchAtom);
}

function showNot(type: NotificationType, data?: any) {
  const id = Math.random().toString();
  showNotification(id, titleLoading[type].replace("{0}", data), null, true);
  return id;
}

function updateNot(
  id: string,
  type: NotificationType,
  res: { success: boolean; code?: number },
  data?: any
) {
  updateNotification(
    id,
    res.success ? titleSuccess[type].replace("{0}", data) : titleError[type],
    icons[type],
    res.success ? "green" : "red",
    res.code ? getErrorMessageFromCode(res.code) : undefined
  );
}

export function usePlay() {
  const playTrack = useActions().playTrack;

  function play(title: string, url: string, isPlaylist?: boolean) {
    const id = showNot(
      !isPlaylist ? NotificationType.Play : NotificationType.Add,
      title
    );
    playTrack(url).then((res) =>
      updateNot(
        id,
        !isPlaylist ? NotificationType.Play : NotificationType.Add,
        res,
        title
      )
    );
  }

  return play;
}

export function useAdd() {
  const addTrack = useActions().addTrack;

  function add(title: string, url: string) {
    const id = showNot(NotificationType.Add, title);
    addTrack(url).then((res) =>
      updateNot(id, NotificationType.Add, res, title)
    );
  }

  return add;
}

export function usePause() {
  const pauseTrack = useActions().pause;

  function pause() {
    const id = showNot(NotificationType.Pause);
    pauseTrack().then((res) => updateNot(id, NotificationType.Pause, res));
  }

  return pause;
}

export function useResume() {
  const resumeTrack = useActions().resume;

  function resume() {
    const id = showNot(NotificationType.Resume);
    resumeTrack().then((res) => updateNot(id, NotificationType.Resume, res));
  }

  return resume;
}

export function useSkip() {
  const skipTrack = useActions().skipTrack;

  function skip(title: string) {
    const id = showNot(NotificationType.Skip);
    skipTrack().then((res) => updateNot(id, NotificationType.Skip, res, title));
  }

  return skip;
}

export function useSkipTo() {
  const skipToTrack = useActions().skipToTrack;

  function skipTo(title: string, index: number) {
    const id = showNot(NotificationType.SkipTo);
    skipToTrack(index).then((res) =>
      updateNot(id, NotificationType.SkipTo, res, title)
    );
  }

  return skipTo;
}

export function useBack() {
  const backTrack = useActions().backTrack;

  function back() {
    const id = showNot(NotificationType.Back);
    backTrack().then((res) => updateNot(id, NotificationType.Back, res));
  }

  return back;
}

export function useSeek() {
  const seek = useActions().seekTrack;

  function seekTo(position: number) {
    const id = showNot(NotificationType.Seek);
    seek(position).then((res) => updateNot(id, NotificationType.Seek, res));
  }

  return seekTo;
}

export function useVolume() {
  const setVolume = useActions().setVolume;

  function set(vol: number) {
    const id = showNot(NotificationType.Volume);
    setVolume(vol).then((res) =>
      updateNot(id, NotificationType.Volume, res, vol)
    );
  }

  return set;
}

export function useRemove() {
  const removeTrack = useActions().removeTrack;

  function remove(title: string, index: number) {
    const id = showNot(NotificationType.Remove);
    removeTrack(index).then((res) =>
      updateNot(id, NotificationType.Remove, res, title)
    );
  }

  return remove;
}

export function useClear() {
  const clearQueue = useActions().clearQueue;

  function clear() {
    const id = showNot(NotificationType.Clear);
    clearQueue().then((res) => updateNot(id, NotificationType.Clear, res));
  }

  return clear;
}

export function useShuffle() {
  const shuffleQueue = useActions().shuffleQueue;

  function shuffle() {
    const id = showNot(NotificationType.Shuffle);
    shuffleQueue().then((res) => updateNot(id, NotificationType.Shuffle, res));
  }

  return shuffle;
}

export function useDistinct() {
  const distinctQueue = useActions().distinctQueue;

  function distinct() {
    const id = showNot(NotificationType.Distinct);
    distinctQueue().then((res) =>
      updateNot(id, NotificationType.Distinct, res)
    );
  }

  return distinct;
}

export function useReverse() {
  const reverseQueue = useActions().reverseQueue;

  function reverse() {
    const id = showNot(NotificationType.Reverse);
    reverseQueue().then((res) => updateNot(id, NotificationType.Reverse, res));
  }

  return reverse;
}

export function useMove() {
  const moveTrack = useActions().moveTrack;

  function move(from: number, to: number) {
    const id = showNot(NotificationType.Move);
    moveTrack(from, to).then((res) =>
      updateNot(
        id,
        NotificationType.Move,
        res,
        `from #${from + 1} to #${to + 1}`
      )
    );
  }

  return move;
}

export function useCycleRepeat() {
  const cycleRepeatMode = useActions().cycleRepeatMode;

  function cycle() {
    const id = showNot(NotificationType.CycleRepeat);
    cycleRepeatMode().then((res) =>
      updateNot(id, NotificationType.CycleRepeat, res)
    );
  }

  return cycle;
}

export function useResumeSession() {
  const resumeSession = useActions().resumeSession;

  function resume() {
    const id = showNot(NotificationType.ResumeSession);
    resumeSession().then((res) =>
      updateNot(id, NotificationType.ResumeSession, res)
    );
  }

  return resume;
}
