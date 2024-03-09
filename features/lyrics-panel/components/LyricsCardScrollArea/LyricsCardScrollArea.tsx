import { currentTrackAtom, localPositionAtom } from "@/stores/atoms";
import { Center, ScrollArea, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { LyricsCardLine } from "../LyricsCardLine/LyricsCardLine";

type LyricsCardScrollAreaProps = {
  height: number;
};

export function LyricsCardScrollArea({ height }: LyricsCardScrollAreaProps) {
  const track = useAtomValue(currentTrackAtom);
  const lyrics = track?.TimedLyrics;
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionMs = useAtomValue(localPositionAtom);

  return (
    <ScrollArea h={height} ref={scrollRef}>
      {lyrics && lyrics.length > 0 ? (
        lyrics.map((line, index) => (
          <LyricsCardLine
            key={index}
            line={line.Line}
            isPast={positionMs > line.Range.End}
            isCurrent={
              positionMs - line.Range.Start >= 0 && positionMs < line.Range.End
            }
            start={line.Range.Start}
          />
        ))
      ) : (
        <Center h={height}>
          <Text size="xl" c="white" ta="center" fw={600}>
            No lyrics available!
          </Text>
        </Center>
      )}
    </ScrollArea>
  );
}
