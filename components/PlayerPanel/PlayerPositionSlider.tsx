"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  botTokenAtom,
  currentTrackAtom,
  localPositionAtom,
  playerStateAtom,
  serverPositionAtom,
} from "@/stores/atoms";
import { PlayerState } from "@/types/socket";
import { seekTrack } from "@/utils/actions";
import { toTime } from "@/utils/helpers";
import { withNotification } from "@/utils/withNotification";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

export function PlayerPositionSlider() {
  const serverPosition = useAtomValue(serverPositionAtom);
  const state = useAtomValue(playerStateAtom);
  const track = useAtomValue(currentTrackAtom);
  const duration = track?.Duration ?? 0;
  const token = useAtomValue(botTokenAtom);

  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useAtom(localPositionAtom);

  useEffect(() => {
    setLocalPosition(serverPosition);
  }, [serverPosition, setLocalPosition]);

  useEffect(() => {
    if (
      !isDragging &&
      localPosition < duration &&
      state === PlayerState.Playing
    ) {
      const interval = setInterval(() => {
        setLocalPosition((p) => p + 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [duration, isDragging, localPosition, setLocalPosition, state]);

  const onChangeCache = useCallback(
    (value: number) => {
      setLocalPosition(value);
      setIsDragging(true);
    },
    [setLocalPosition],
  );

  const onChangeEnd = useCallback(
    async (value: number) => {
      withNotification(await seekTrack(Math.round(value / 1000), token));
      setIsDragging(false);
    },
    [token],
  );

  if (serverPosition === undefined)
    return <Skeleton className="h-[10px] w-full" />;

  return (
    <div className="flex flex-nowrap items-center gap-2">
      <span className="w-max text-xs">
        {toTime(Math.round(localPosition / 1000))}
      </span>

      <Slider
        step={1}
        max={duration}
        value={[localPosition ?? 0]}
        onValueChange={(v) => onChangeCache(v[0])}
        onValueCommit={async (v) => await onChangeEnd(v[0])}
      />
      <span className="w-max text-xs">
        {`-${toTime(Math.round(duration / 1000 - localPosition / 1000))}`}
      </span>
    </div>
  );
}
