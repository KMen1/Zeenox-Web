"use client";

import { Flex, Slider, Text, rem, useMantineColorScheme } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toTime } from ".";
import { useSocketAction } from "../SocketProvider";
import { useCurrentTrack } from "../CurrentTrackProvider";
import { usePlayerPosition } from "../PlayerPositionProvider";

export default function PlayerWidgetPositionSlider() {
  const { colorScheme } = useMantineColorScheme();
  const position = usePlayerPosition();
  const duration = useCurrentTrack().Duration;
  const performAction = useSocketAction()!;

  const [isDragging, setIsDragging] = useState(false);
  const [_position, setPosition] = useState(position);
  useEffect(() => {
    if (!isDragging) {
      setPosition(position);
    }
  }, [isDragging, position]);

  const onChangeCache = useCallback((value: number) => {
    setPosition(value);
    setIsDragging(true);
  }, []);

  const onChangeEnd = useCallback(
    (value: number) => {
      void performAction("seek", { position: value });
      setIsDragging(false);
    },
    [performAction]
  );

  const durationHuman = useMemo(() => toTime(duration), [duration]);

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
        styles={(theme) => ({
          track: {
            backgroundColor:
              colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.dark[1],
          },
          thumb: {
            height: rem(12),
            width: rem(12),
            backgroundColor: theme.white,
            borderWidth: rem(0),
            boxShadow: theme.shadows.md,
          },
          bar: {
            backgroundColor: "white",
          },
        })}
      />
      <Flex justify="space-between" mt={4}>
        <Text size="xs" lh={1}>
          {toTime(_position)}
        </Text>
        <Text size="xs" lh={1}>
          {durationHuman}
        </Text>
      </Flex>
    </div>
  );
}
