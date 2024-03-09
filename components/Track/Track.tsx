"use client";

import { botTokenAtom } from "@/stores/atoms";
import { Track } from "@/types/socket";
import { toTime } from "@/utils/helpers";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconGripVertical,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
  IconRefreshDot,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import {
  addTrack,
  playTrack,
  removeTrack,
  skipToTrack,
} from "../../utils/actions";
import { withNotification } from "../../utils/withNotification";
import classes from "./Track.module.css";

type TrackProps = {
  track: Track;
  index?: number;
  hoverable?: boolean;
  transparent?: boolean;
  mode: "play" | "skipTo" | "none";
  showRequestedBy?: boolean;
  withAdd?: boolean;
  withRemove?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export function Track({
  track,
  index,
  hoverable,
  transparent,
  mode = "none",
  showRequestedBy,
  withAdd,
  withRemove,
  dragHandleProps,
}: TrackProps) {
  const token = useAtomValue(botTokenAtom);

  return (
    <Group
      align="center"
      gap="sm"
      wrap="nowrap"
      className={classes.track}
      data-hoverable={hoverable}
      data-transparent={transparent}
    >
      {dragHandleProps && (
        <div {...dragHandleProps} className={classes.dragHandle}>
          <IconGripVertical size={15} />
        </div>
      )}
      <div className="relative min-w-[36px] min-h-[36px]">
        <Image
          src={
            track?.ArtworkUrl ??
            "https://misc.scdn.co/liked-songs/liked-songs-640.png"
          }
          width={36}
          height={36}
          className={classes.thumbnail}
          alt={track?.Title ?? "Nothing here"}
        />
        {track && mode !== "none" && (
          <div className="absolute top-[.5rem] left-[.5rem]">
            <Tooltip label={`Play ${track.Title} by ${track.Author}`}>
              <IconPlayerPlayFilled
                role="button"
                size="1.2rem"
                className={classes.playButton}
                onClick={
                  mode === "skipTo"
                    ? async () =>
                        withNotification(await skipToTrack(index!, token))
                    : async () =>
                        withNotification(
                          await playTrack(track.Url ?? "", token)
                        )
                }
              />
            </Tooltip>
          </div>
        )}
      </div>

      <Stack gap={0}>
        <Text
          size="0.9rem"
          lineClamp={1}
          lh={1.4}
          component="a"
          href={track?.Url!}
          target="_blank"
          title={track?.Title}
          className={classes.trackTitle}
        >
          {track?.Title}
        </Text>
        <Text
          size="0.8rem"
          lineClamp={1}
          lh={1.4}
          title={track?.Author}
          className={classes.trackAuthor}
        >
          {track?.Author}
        </Text>
      </Stack>

      {withRemove && (
        <Tooltip label="Remove from queue" position="top">
          <ActionIcon
            size={20}
            variant="light"
            color="red"
            aria-label="Remove Track"
            onClick={async () =>
              withNotification(await removeTrack(index!, token))
            }
            className={classes.button}
          >
            <IconTrash size={13} />
          </ActionIcon>
        </Tooltip>
      )}
      {withAdd && (
        <Tooltip label="Add to queue" position="top">
          <ActionIcon
            size={20}
            variant="light"
            color="dark.1"
            aria-label="Add to queue"
            onClick={async () =>
              withNotification(await addTrack(track.Url ?? "", token))
            }
            className="ml-auto"
          >
            <IconPlaylistAdd size={15} />
          </ActionIcon>
        </Tooltip>
      )}
      <Text
        size="0.8rem"
        className={classes.trackDuration}
        data-left={!withAdd && !withRemove}
      >
        {toTime(Math.round(track?.Duration / 1000))}
      </Text>

      {track?.RequestedBy !== null && showRequestedBy && (
        <Tooltip label={track.RequestedBy.DisplayName} position="top">
          <Image
            src={track.RequestedBy.AvatarUrl ?? "/placeholder-user.png"}
            width={15}
            height={15}
            alt={track.RequestedBy.DisplayName}
            style={{ borderRadius: "50%" }}
          />
        </Tooltip>
      )}
      {track?.RequestedBy === null && mode === "skipTo" && (
        <Tooltip label="Autoplay" position="top">
          <IconRefreshDot size={15} />
        </Tooltip>
      )}
    </Group>
  );
}
