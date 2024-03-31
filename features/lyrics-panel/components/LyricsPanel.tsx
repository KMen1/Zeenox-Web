"use client";

import { trackColorAtom } from "@/stores/atoms";
import { IconBlockquote } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { ContentCard } from "../../../components/ContentCard/ContentCard";
import { useSize } from "../../../hooks/useSize";
import { LyricsCardScrollArea } from "./LyricsScrollArea";

export function LyricsCard() {
  const windowSize = useSize();
  const height = windowSize[1] - 326;
  const color = useAtomValue(trackColorAtom);

  return (
    <ContentCard title="Lyrics" icon={<IconBlockquote />} bg={color}>
      <div className="relative p-4">
        <LyricsCardScrollArea height={height} />
      </div>
    </ContentCard>
  );
}
