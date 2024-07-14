import { Center } from "@/components/ui/center";
import { currentTrackAtom, localPositionAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { LyricsLine } from "./LyricsLine";

export function LyricsCardScrollArea() {
  const track = useAtomValue(currentTrackAtom);
  const timedLyrics = track?.TimedLyrics;
  const lyrics = track?.Lyrics;
  const scrollRef = useRef<HTMLDivElement>(null);
  const position = useAtomValue(localPositionAtom);

  const lyricsLines =
    timedLyrics?.map((line, index) => (
      <LyricsLine
        key={index}
        line={line.Line}
        isPast={position > line.Range.End}
        isCurrent={
          position - line.Range.Start >= 0 && position < line.Range.End
        }
        start={line.Range.Start}
      />
    )) ??
    lyrics?.map((line, index) => <LyricsLine key={index} line={line} />) ??
    null;

  if (!lyricsLines) {
    return (
      <Center>
        <p className="text-center text-2xl font-semibold">
          No lyrics available!
        </p>
      </Center>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="overflow-y-scroll"
      style={{ height: "max(calc(-200px + 750px), calc(-300px + 100vh))" }}
    >
      {lyricsLines}
    </div>
  );
}
