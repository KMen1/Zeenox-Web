"use client";

import { Flex, Skeleton, Slider, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessageFromCode, toTime } from "@/utils/utils";
import { PlayerState } from "@/types";
import classes from "./PlayerPositionSlider.module.css";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import {
  IconExclamationMark,
  IconPlayerTrackNextFilled,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import {
  actionFetchAtom,
  durationAtom,
  initAtom,
  positionAtom,
  stateAtom,
  trackAtom,
} from "@/utils/atoms";

export function PlayerPositionSlider() {
  const position = useAtomValue(positionAtom);
  const initData = useAtomValue(initAtom);
  const initialPosition = initData?.Position;
  const state = useAtomValue(stateAtom);
  const track = useAtomValue(trackAtom);
  const duration = useAtomValue(durationAtom);
  const { seekTrack } = useAtomValue(actionFetchAtom);

  const [isDragging, setIsDragging] = useState(false);
  const [_position, setPosition] = useState(initialPosition ?? 0);

  useEffect(() => {
    setPosition(position);
  }, [position]);

  useEffect(() => {
    if (track && position >= track.Duration) {
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
  }, [_position, duration, isDragging, state]);

  const onChangeCache = useCallback((value: number) => {
    setPosition(value);
    setIsDragging(true);
  }, []);

  const seek = useCallback(
    (pos: number) => {
      const id = `seek-${Date.now()}`;
      showNotification(id, "Seeking track", null, true);
      seekTrack(pos).then((res) => {
        if (res.success) {
          updateNotification(
            id,
            "Seeking track",
            <IconPlayerTrackNextFilled />,
            "green",
            "Successfully seeked track!"
          );
        } else {
          updateNotification(
            id,
            "Unable to seek track",
            <IconExclamationMark />,
            "red",
            getErrorMessageFromCode(res.code!)
          );
        }
      });
    },
    [seekTrack]
  );

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
