"use client";

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
        setLocalPosition((p) => p + 50);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [duration, isDragging, localPosition, setLocalPosition, state]);

  const onChangeCache = useCallback(
    (value: number) => {
      setLocalPosition(value);
      setIsDragging(true);
    },
    [setLocalPosition]
  );

  const onChangeEnd = useCallback(
    async (value: number) => {
      withNotification(await seekTrack(Math.round(value / 1000), token));
      setIsDragging(false);
    },
    [token]
  );

  if (serverPosition === undefined)
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
            {toTime(Math.round(localPosition / 1000))}
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
            {`-${toTime(Math.round(duration / 1000 - localPosition / 1000))}`}
          </Text>
        ) : null}
        {size === "md" ? (
          <Flex justify="space-between" mt={4}>
            <Text size={textSizeDict[size]} lh={1} className={classes.timeText}>
              {toTime(localPosition / 1000)}
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
