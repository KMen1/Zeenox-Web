"use client";

import { botTokenAtom, currentTrackAtom } from "@/utils/atoms";
import { Box, Center, ScrollArea, Skeleton, Stack, Text } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { getLyrics } from "../actions";
import { useSize } from "../useSize";

export function LyricsCard() {
  const [lyricsHtml, setLyricsHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const track = useAtomValue(currentTrackAtom);
  const token = useAtomValue(botTokenAtom);
  const windowSize = useSize();
  const height = (windowSize[1] - 425) / 2;

  useEffect(() => {
    async function fetchLyricsHtml() {
      setIsLoading(true);
      setLyricsHtml(null);
      const res = await getLyrics(token);
      if (res.success) {
        setLyricsHtml(res.message);
      }
      setIsLoading(false);
    }

    if (track?.Url) fetchLyricsHtml();
    else {
      setLyricsHtml(null);
      setIsLoading(false);
    }
  }, [token, track]);

  const SKELETON_COUNT = height / 20 - 2;
  const skeleton = Array.from({ length: SKELETON_COUNT }).map((_, index) => (
    <Skeleton key={index} height={20} />
  ));

  return (
    <Box pos="relative" maw={350} w={350}>
      <Box pos="relative">
        {isLoading && (
          <Stack h={height} gap="xs">
            {skeleton}
          </Stack>
        )}
        {lyricsHtml && (
          <ScrollArea h={height}>
            <Text
              lh={1.4}
              dangerouslySetInnerHTML={{ __html: lyricsHtml || "" }}
            />
          </ScrollArea>
        )}
        {!lyricsHtml && !isLoading && (
          <Center h={height} w="100%" p="xl">
            <Stack gap={0} align="center">
              <IconMoodSad size={100} />
              <Text fw={700} size="xl">
                No lyrics found
              </Text>
            </Stack>
          </Center>
        )}
      </Box>
    </Box>
  );
}
