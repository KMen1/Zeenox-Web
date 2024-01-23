"use client";

import { serverSessionTokenAtom, trackAtom } from "@/utils/atoms";
import {
  Box,
  Card,
  Center,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export function LyricsCard() {
  const [lyricsHtml, setLyricsHtml] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(true);
  const track = useAtomValue(trackAtom);
  const token = useAtomValue(serverSessionTokenAtom);

  useEffect(() => {
    async function fetchLyricsHtml() {
      setIsLoading(true);
      setLyricsHtml(null);
      const res = await fetch(`/api/player/lyrics?token=${token}`);
      if (res.ok) {
        const html = await res.text();
        setLyricsHtml(html);
      }
      setIsLoading(false);
    }

    fetchLyricsHtml();
  }, [token, track]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "lg", blur: 3 }}
      />
      <Card>
        <ScrollArea h={403}>
          {lyricsHtml === null ? (
            <Center h={403} p="xl">
              <Stack gap={0} align="center">
                <IconMoodSad size={100} />
                <Text fw={700} size="xl">
                  No Lyrics Found
                </Text>
              </Stack>
            </Center>
          ) : (
            <Text>
              <div dangerouslySetInnerHTML={{ __html: lyricsHtml || "" }} />
            </Text>
          )}
        </ScrollArea>
      </Card>
    </Box>
  );
}
