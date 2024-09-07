import { Center } from "@/components/ui/center";
import { currentTrackAtom, localPositionAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { LyricsLine } from "./LyricsLine";

export function LyricsCardScrollArea() {
  const track = useAtomValue(currentTrackAtom);
  const lyrics = track?.Lyrics;
  const scrollRef = useRef<HTMLDivElement>(null);
  const position = useAtomValue(localPositionAtom);

  let lyricsLines = lyrics?.lines?.map((line, index) => (
    <LyricsLine
      key={index}
      line={line.line}
      isPast={position > line.timestamp}
      isCurrent={false}
      start={line.timestamp}
    />
  ));

  if (lyricsLines) {
    const currentLine = lyricsLines.findIndex(
      (line) => line.props.start && position < line.props.start,
    );
    if (currentLine !== -1) {
      lyricsLines = lyricsLines.map((line, index) => (
        <LyricsLine
          key={index}
          line={line.props.line}
          isPast={index < currentLine}
          isCurrent={index === currentLine}
          start={line.props.start}
        />
      ));
    }
  }

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
