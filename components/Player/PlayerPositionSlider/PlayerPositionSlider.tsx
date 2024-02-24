"use client";

import { seekTrack } from "@/components/actions";
import { withNotification } from "@/components/withNotification";
import { PlayerState } from "@/types/socket";
import {
  botTokenAtom,
  currentTrackAtom,
  initAtom,
  playerStateAtom,
  positionAtom,
} from "@/utils/atoms";
import { toTime } from "@/utils/utils";
import { Center, Flex, Group, Skeleton, Slider, Text } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import classes from "./PlayerPositionSlider.module.css";

const sliderSizeDict = {
  sm: 4,
  md: "xs",
};

const textSizeDict = {
  sm: "0.7rem",
  md: "xs",
};

function Container({
  size,
  children,
}: {
  size: "sm" | "md";
  children: React.ReactNode;
}) {
  if (size === "sm")
    return (
      <Group gap={10} wrap="nowrap">
        {children}
      </Group>
    );

  return <div>{children}</div>;
}

export function PlayerPositionSlider({ size }: { size: "sm" | "md" }) {
  const serverPosition = useAtomValue(positionAtom);
  const initData = useAtomValue(initAtom);
  const initialPosition = initData?.Position;
  const [state, setState] = useAtom(playerStateAtom);
  const track = useAtomValue(currentTrackAtom);
  const duration = track?.Duration ?? 0;
  const token = useAtomValue(botTokenAtom);

  const [hasSetInitialPosition, setHasSetInitialPosition] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState(0);

  useEffect(() => {
    setLocalPosition(serverPosition);
  }, [serverPosition]);

  useEffect(() => {
    if (track && !hasSetInitialPosition) {
      setLocalPosition(0);
      setState(PlayerState.Playing);
    }
  }, [hasSetInitialPosition, setState, track]);

  useEffect(() => {
    if (initialPosition && !hasSetInitialPosition) {
      setLocalPosition(initialPosition);
      setHasSetInitialPosition(true);
    }
  }, [initialPosition, hasSetInitialPosition]);

  useEffect(() => {
    if (
      !isDragging &&
      localPosition < duration &&
      state === PlayerState.Playing
    ) {
      const interval = setInterval(() => {
        setLocalPosition((p) => p + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [localPosition, duration, isDragging, state, track?.Duration]);

  const onChangeCache = useCallback((value: number) => {
    setLocalPosition(value);
    setIsDragging(true);
  }, []);

  const onChangeEnd = useCallback(
    async (value: number) => {
      withNotification(await seekTrack(value, token));
      setIsDragging(false);
    },
    [token]
  );

  if (initialPosition === undefined)
    return (
      <Center>
        <Skeleton w="100%" h={10} />
      </Center>
    );

  return (
    <Container size={size}>
      <>
        {size === "sm" ? (
          <Text
            size={textSizeDict[size]}
            lh={1}
            className={classes.timeText}
            w="min-content"
          >
            {toTime(localPosition)}
          </Text>
        ) : null}
        <Slider
          value={localPosition ?? 0}
          onChange={onChangeCache}
          max={duration}
          size={sliderSizeDict[size]}
          label={null}
          thumbSize={12}
          showLabelOnHover={false}
          onChangeEnd={onChangeEnd}
          classNames={classes}
          w="100%"
        />
        {size === "sm" ? (
          <Text
            size={textSizeDict[size]}
            lh={1}
            className={classes.timeText}
            w="min-content"
          >
            {`-${toTime(duration - localPosition)}`}
          </Text>
        ) : null}
        {size === "md" ? (
          <Flex justify="space-between" mt={4}>
            <Text size={textSizeDict[size]} lh={1} className={classes.timeText}>
              {toTime(localPosition)}
            </Text>
            <Text size={textSizeDict[size]} lh={1} className={classes.timeText}>
              {`-${toTime(
                localPosition > duration ? duration : duration - localPosition
              )}`}
            </Text>
          </Flex>
        ) : null}
      </>
    </Container>
  );
}
