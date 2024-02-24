"use client";

import { currentTrackAtom } from "@/utils/atoms";
import { getAvgColor } from "@/utils/colorUtils";
import {
  Box,
  Card,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { PlayerControls } from "../Player/PlayerControls/PlayerControls";
import { PlayerPositionSlider } from "../Player/PlayerPositionSlider/PlayerPositionSlider";
import { PlayerVolumeSlider } from "../Player/PlayerVolumeSlider/PlayerVolumeSlider";
import classes from "./Player2.module.css";

export function Player2() {
  const track = useAtomValue(currentTrackAtom);
  const [color, setColor] = useState("black");
  const { colorScheme } = useMantineColorScheme();

  const handleColorChange = useCallback(() => {
    const color = getAvgColor(document, ".player2-background")?.value;
    setColor(
      color
        ? `rgba(${color?.[0]}, ${color?.[1]}, ${color?.[2]}, ${
            colorScheme === "dark" ? 0.5 : 1
          })`
        : "black"
    );
  }, [colorScheme]);

  useEffect(() => {
    handleColorChange();
  }, [colorScheme, handleColorChange]);

  return (
    <Card
      className="player2-background fixed bottom-0"
      style={{ background: color }}
    >
      <Group justify="space-between">
        <Box style={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>
          <Group wrap="nowrap">
            <Image
              src={track?.ArtworkUrl || "/placeholder-album.jpeg"}
              width={64}
              height={64}
              alt={track?.Title || "No track playing"}
              crossOrigin="anonymous"
              onLoad={handleColorChange}
              style={{ borderRadius: "0.4rem" }}
            />
            <Stack gap={0}>
              <Text
                size="xl"
                fw={600}
                c="white"
                lineClamp={1}
                lh={1.4}
                component="a"
                href={track?.Url!}
                target="_blank"
                title={track?.Title}
                className={classes.title}
              >
                {track?.Title || "No track playing"}
              </Text>
              <Text
                size="sm"
                fw={400}
                lineClamp={1}
                lh={1.4}
                title={track?.Author}
                className={classes.author}
              >
                {track?.Author || "No author"}
              </Text>
            </Stack>
          </Group>
        </Box>
        <Box style={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <Stack gap={10} w="100%">
            <PlayerControls size="sm" />
            <PlayerPositionSlider size="sm" />
          </Stack>
        </Box>
        <Box style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          <PlayerVolumeSlider />
        </Box>
      </Group>
    </Card>
  );
}
