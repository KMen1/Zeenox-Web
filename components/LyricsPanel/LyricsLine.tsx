import { botTokenAtom } from "@/stores/atoms";
import { seekTrack } from "@/utils/actions";
import { useAtomValue } from "jotai";
import { memo, useCallback, useRef } from "react";

const LyricsLine = memo(function LyricsLine({
  line,
  isPast,
  isCurrent,
  start,
}: {
  line: string;
  isPast?: boolean;
  isCurrent?: boolean;
  start?: number;
}) {
  const botToken = useAtomValue(botTokenAtom);
  const ref = useRef<HTMLDivElement>(null);
  if (isCurrent) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  const seek = useCallback(async () => {
    if (!botToken || !start) return;
    await seekTrack(Math.round(start / 1000), botToken);
  }, [botToken, start]);

  return (
    <p
      className={`text-xl font-semibold leading-relaxed ${
        isCurrent
          ? "text-white"
          : isPast
            ? "text-[rgba(255,255,255,0.7)]"
            : "text-black"
      } ${
        start ? "cursor-pointer hover:text-white" : "cursor-default"
      } transition-colors duration-75 ease-in-out`}
      style={{ whiteSpace: "pre-wrap" }}
      ref={ref}
      role="button"
      onClick={start ? seek : undefined}
    >
      {line}
    </p>
  );
});

export { LyricsLine };
