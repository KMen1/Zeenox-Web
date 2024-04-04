"use client";

import { trackColorAtom } from "@/stores/atoms";
import { IconBlockquote } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { ContentCard } from "../../../components/ContentCard/ContentCard";
import { LyricsCardScrollArea } from "./LyricsScrollArea";

export function LyricsCard() {
  const color = useAtomValue(trackColorAtom);

  return (
    <ContentCard
      title="Lyrics"
      icon={<IconBlockquote />}
      bg={color}
      className="[grid-area:extra]"
    >
      <LyricsCardScrollArea />
    </ContentCard>
  );
}
