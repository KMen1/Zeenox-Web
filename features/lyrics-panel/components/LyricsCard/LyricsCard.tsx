"use client";

import { trackColorAtom } from "@/stores/atoms";
import { Box } from "@mantine/core";
import { IconBlockquote } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { ContentCard } from "../../../../components/ContentCard/ContentCard";
import { useSize } from "../../../../hooks/useSize";
import { LyricsCardScrollArea } from "../LyricsCardScrollArea/LyricsCardScrollArea";

export function LyricsCard() {
  const windowSize = useSize();
  const height = (windowSize[1] - 425) / 2;

  const color = useAtomValue(trackColorAtom);

  return (
    <ContentCard
      title="Lyrics"
      icon={<IconBlockquote />}
      bg={typeof color == "string" ? color : undefined}
    >
      <Box pos="relative" maw={350} w={350}>
        <LyricsCardScrollArea height={height} />
      </Box>
    </ContentCard>
  );
}
