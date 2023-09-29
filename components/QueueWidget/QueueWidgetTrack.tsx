"use client";

import { type TrackData } from "@/types";
import { Flex, Text, useMantineColorScheme } from "@mantine/core";
import {
  IconHeartFilled,
  IconPlayerPlayFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback } from "react";
import { toTime } from "../PlayerWidget";
import styles from "./QueueWidgetTrack.module.css";
import { useSocketAction } from "../SocketProvider";

function QueueWidgetTrack({
  track,
  index,
}: {
  track: TrackData;
  index: number;
}) {
  const performAction = useSocketAction()!;

  const skipto = useCallback(
    () => void performAction("skipto", { index }),
    [index, performAction]
  );
  const remove = useCallback(
    () => void performAction("remove", { index }),
    [index, performAction]
  );
  const like = useCallback(
    () => void performAction("like", { index }),
    [index, performAction]
  );
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <Flex
      align="center"
      gap="sm"
      px="sm"
      className={`${
        styles.track
      } rounded-sm py-[0.3525rem] pr-2 duration-75 ease-in-out ${
        colorScheme === "dark" ? "hover:bg-zinc-700" : "hover:bg-zinc-100"
      } `}
      onDoubleClick={skipto}
    >
      {
        <div className="relative inline-block h-[16px] min-h-[16px] w-[16px] min-w-[16px]">
          <IconPlayerPlayFilled
            size="0.9rem"
            role="button"
            onClick={skipto}
            className={`${styles.play} ${
              colorScheme === "dark" ? "text-white" : "text-black"
            } absolute right-[0.1rem] top-[0.1rem] duration-75 ease-in-out hover:text-gray-300`}
          />
          <Text
            size="0.9rem"
            className={`${styles.index} rtl absolute -top-[0.2rem] right-1 z-0 text-right`}
          >
            {index + 1}
          </Text>
        </div>
      }
      <Image
        src={track.Thumbnail ?? "/placeholder-album.png"}
        width={34}
        height={34}
        alt={track.Title}
        style={{ borderRadius: "0.15rem" }}
      />
      <Flex direction="column" gap={6}>
        <Text c={dark ? "white" : "black"} size="0.9rem" lh={1} lineClamp={1}>
          {track.Title}
        </Text>
        <Text size="0.8rem" c={dark ? "" : "dimmed"} lh={1}>
          {track.Author}
        </Text>
      </Flex>
      <IconTrashFilled
        size="0.9rem"
        role="button"
        onClick={remove}
        className={`${styles.play} ${
          colorScheme === "dark" ? "text-white" : "text-black"
        } ml-auto duration-75 ease-in-out hover:text-gray-300`}
      />
      <IconHeartFilled
        role="button"
        size="0.9rem"
        onClick={like}
        className={`${styles.play} text-[#1bc458] duration-100 ease-in-out hover:text-gray-300`}
      />
      <Text size="0.8rem">{toTime(track.Duration)}</Text>
      <Image
        src={track.RequestedBy.AvatarUrl ?? "/placeholder-avatar.png"}
        width={16}
        height={16}
        alt={track.RequestedBy.DisplayName}
        style={{ borderRadius: "50%" }}
      />
    </Flex>
  );
}

export default QueueWidgetTrack;
