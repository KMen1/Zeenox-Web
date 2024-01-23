"use client";

import { GradientBackground } from "@/utils/utils";
import { Skeleton, Stack, Text, useMantineColorScheme } from "@mantine/core";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import classes from "./PlayerSongInfoDisplay.module.css";
import { useAtomValue } from "jotai";
import { trackAtom } from "@/utils/atoms";

export function PlayerSongInfoDisplay() {
  const track = useAtomValue(trackAtom);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const setGradientBackground = useCallback(
    () => GradientBackground(document, ".player-background", isDark),
    [isDark]
  );

  const title = track?.Title || "Start playing something";
  const author = track?.Author || ">_<";

  useEffect(() => {
    setGradientBackground();
  }, [setGradientBackground, colorScheme]);

  if (!track)
    return (
      <>
        <Skeleton h={178} w={178} radius="md" />
        <Skeleton w={67} h={10} />
        <Skeleton w={50} h={10} />
      </>
    );

  return (
    <>
      <Image
        priority
        src={track.Thumbnail || "/placeholder-album.jpeg"}
        alt={track.Title || "Placeholder Album Art"}
        width={200}
        height={200}
        crossOrigin="anonymous"
        style={{ borderRadius: "0.4rem" }}
        onLoad={setGradientBackground}
      />
      <Stack gap={0}>
        <Text
          size="lg"
          fw={600}
          lineClamp={1}
          lh={1.4}
          component="a"
          href={track.Url!}
          target="_blank"
          title={title}
          className={classes.title}
        >
          {title}
        </Text>
        <Text
          size="sm"
          lineClamp={1}
          lh={1.4}
          title={author}
          fw={400}
          className={classes.author}
        >
          {author}
        </Text>
      </Stack>
    </>
  );
}
