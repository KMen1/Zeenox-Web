import { Center } from "@/components/ui/center";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentTrackAtom, localPositionAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { LyricsLine } from "./LyricsLine";

export function LyricsCardScrollArea() {
  const track = useAtomValue(currentTrackAtom);
  const timedLyrics = track?.TimedLyrics;
  const lyrics = track?.Lyrics;
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionMs = useAtomValue(localPositionAtom);
  const [position, setPosition] = useState(positionMs);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((p) => p + 50);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPosition(positionMs);
  }, [positionMs]);

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

  return lyricsLines ? (
    <ScrollArea
      className="p-4"
      ref={scrollRef}
      style={{ height: "max(calc(-200px + 750px), calc(-300px + 100vh))" }}
    >
      {lyricsLines}
    </ScrollArea>
  ) : (
    <Center>
      <p className="text-center text-2xl font-semibold">No lyrics available!</p>
    </Center>
  );
}
