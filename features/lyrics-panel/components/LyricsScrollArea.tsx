import { Center } from "@/components/ui/center";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentTrackAtom, localPositionAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { LyricsLine } from "./LyricsLine";

type LyricsCardScrollAreaProps = {
  height: number;
};

export function LyricsCardScrollArea({ height }: LyricsCardScrollAreaProps) {
  const track = useAtomValue(currentTrackAtom);
  const timedLyrics = track?.TimedLyrics;
  const lyrics = track?.Lyrics;
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionMs = useAtomValue(localPositionAtom);

  const lyricsLines =
    timedLyrics?.map((line, index) => (
      <LyricsLine
        key={index}
        line={line.Line}
        isPast={positionMs > line.Range.End}
        isCurrent={
          positionMs - line.Range.Start >= 0 && positionMs < line.Range.End
        }
        start={line.Range.Start}
      />
    )) ??
    lyrics?.map((line, index) => <LyricsLine key={index} line={line} />) ??
    null;

  return (
    <ScrollArea style={{ height }} ref={scrollRef}>
      {lyricsLines ? (
        lyricsLines
      ) : (
        <Center height={height}>
          <p className="text-center text-2xl font-semibold">
            No lyrics available!
          </p>
        </Center>
      )}
    </ScrollArea>
  );
}
