"use client";

import { currentTrackAtom, selectedAtom, trackColorAtom } from "@/stores/atoms";
import { getAvgColor } from "@/utils/colorHelpers";
import {
  ActionIcon,
  Box,
  Card,
  Group,
  Stack,
  Text,
  darken,
  luminance,
  useMantineColorScheme,
} from "@mantine/core";
import { IconLayoutList, IconMicrophone2 } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { PlayerControls } from "../PlayerControls/PlayerControls";
import { PlayerPositionSlider } from "../PlayerPositionSlider/PlayerPositionSlider";
import { PlayerVolumeSlider } from "../PlayerVolumeSlider/PlayerVolumeSlider";
import classes from "./PlayerBar.module.css";

export function PlayerBar() {
  const track = useAtomValue(currentTrackAtom);
  const { colorScheme } = useMantineColorScheme();
  const [color, setColor] = useAtom(trackColorAtom);
  const [selectedPanel, setSelectedPanel] = useAtom(selectedAtom);

  const handleColorChange = useCallback(() => {
    const color = getAvgColor(document, ".player2-background")?.value;
    const rgba = `rgba(${color?.[0]}, ${color?.[1]}, ${color?.[2]}, 1)`;
    setColor(color ? rgba : "black");

    const cLuminance = luminance(rgba);
    const tLuminance = 1;

    const contrast = (tLuminance + 0.05) / (cLuminance + 0.05);
    if (contrast < 4.5) {
      const darkenAmount = 0.5 - contrast / 10;
      const newColor = darken(rgba, darkenAmount);
      setColor(newColor);

      const newContrast = (tLuminance + 0.05) / (luminance(newColor) + 0.05);
      console.info(
        "Color contrast is too low, darkening the color",
        newContrast
      );
    }
  }, [setColor]);

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
              <Marquee pauseOnHover delay={15} speed={25}>
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
              </Marquee>

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
          <Group gap={3}>
            <div>
              <ActionIcon
                variant="transparent"
                color={selectedPanel === "actions" ? "black" : "white"}
                onClick={() => setSelectedPanel("actions")}
              >
                <IconLayoutList size={18} />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color={selectedPanel === "lyrics" ? "black" : "white"}
                onClick={() => setSelectedPanel("lyrics")}
              >
                <IconMicrophone2 size={18} />
              </ActionIcon>
            </div>

            <PlayerVolumeSlider />
          </Group>
        </Box>
      </Group>
    </Card>
  );
}
