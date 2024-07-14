"use client";

import { IconBlockquote } from "@tabler/icons-react";
import { ContentCard } from "../ContentCard/ContentCard";
import { LyricsCardScrollArea } from "./LyricsScrollArea";

export function LyricsCard() {
  return (
    <ContentCard
      title="Lyrics"
      icon={<IconBlockquote />}
      className="[grid-area:extra]"
    >
      <LyricsCardScrollArea />
    </ContentCard>
  );
}
