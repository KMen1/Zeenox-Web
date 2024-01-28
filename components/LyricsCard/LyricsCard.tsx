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
import { IconMoodSad, IconSettings } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export function LyricsCard() {
  const [lyricsHtml, setLyricsHtml] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(1);
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

    if (track?.Url) fetchLyricsHtml();
    else setLyricsHtml(null);
  }, [token, track]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "lg", blur: 3 }}
      />
      <Card pos="relative">
        {/*<Popover position="left" width={150}>
          <Popover.Target>
            <ActionIcon variant="light" color="gray">
              <IconSettings />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Slider
              title="Font Size"
              step={0.1}
              defaultValue={1}
              min={0.1}
              max={2}
              onChange={(val) => setFontSize(val)}
            />
          </Popover.Dropdown>
  </Popover>*/}

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
            <Text
              size={`${fontSize}rem`}
              lh={1.4}
              dangerouslySetInnerHTML={{ __html: lyricsHtml || "" }}
            />
          )}
        </ScrollArea>
      </Card>
    </Box>
  );
}
