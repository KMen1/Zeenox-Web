"use client";

import { Flex, Skeleton, Slider, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { toTime } from "@/utils/utils";
import { PlayerState } from "@/types/socket";
import classes from "./PlayerPositionSlider.module.css";
import { useAtom, useAtomValue } from "jotai";
import {
  durationAtom,
  initAtom,
  positionAtom,
  stateAtom,
  trackAtom,
} from "@/utils/atoms";
import { useSeek } from "@/components/hooks";

export function PlayerPositionSlider() {
  const position = useAtomValue(positionAtom);
  const initData = useAtomValue(initAtom);
  const initialPosition = initData?.Position;
  const [state, setState] = useAtom(stateAtom);
  const track = useAtomValue(trackAtom);
  const duration = useAtomValue(durationAtom);
  const seek = useSeek();

  const [isDragging, setIsDragging] = useState(false);
  const [_position, setPosition] = useState(initialPosition ?? 0);

  useEffect(() => {
    setPosition(position);
  }, [position]);

  useEffect(() => {
    if (track && position >= track.Duration) {
      setPosition(0);
    } else if (track && position === 0) {
      setPosition(0);
    }
  }, [position, track]);

  useEffect(() => {
    if (
      !isDragging &&
      _position != -1 &&
      _position < duration &&
      state === PlayerState.Playing
    ) {
      const interval = setInterval(() => {
        setPosition((p) => p + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [_position, duration, isDragging, state, track?.Duration]);

  const onChangeCache = useCallback((value: number) => {
    setPosition(value);
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (track?.Duration != 0) {
      setState(PlayerState.Playing);
    }
  }, [setState, track]);

  const onChangeEnd = useCallback(
    (value: number) => {
      seek(value);
      setIsDragging(false);
    },
    [seek]
  );

  if (initialPosition === undefined) return <Skeleton w={178} h={10} />;

  return (
    <div>
      <Slider
        value={_position ?? 0}
        onChange={onChangeCache}
        max={duration}
        size="xs"
        label={null}
        thumbSize={12}
        showLabelOnHover={false}
        onChangeEnd={onChangeEnd}
        classNames={classes}
      />
      <Flex justify="space-between" mt={4}>
        <Text size="xs" lh={1} className={classes.timeText}>
          {toTime(_position)}
        </Text>
        <Text size="xs" lh={1} className={classes.timeText}>
          {`-${toTime(duration - _position)}`}
        </Text>
      </Flex>
    </div>
  );
}
