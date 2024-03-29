import { botTokenAtom } from "@/stores/atoms";
import { seekTrack } from "@/utils/actions";
import { Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { memo, useCallback, useRef } from "react";
import classes from "./LyricsCardLine.module.css";

const LyricsCardLine = memo(function LyricsCardLine({
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
    <Text
      size="xl"
      style={{ whiteSpace: "pre-wrap" }}
      c={isCurrent ? "white" : isPast ? "rgba(255, 255, 255, 0.7)" : "black"}
      ref={ref}
      fw={600}
      onClick={start ? seek : undefined}
      className={classes.line}
      data-synced={start ? true : false}
    >
      {line}
    </Text>
  );
});

export { LyricsCardLine };
