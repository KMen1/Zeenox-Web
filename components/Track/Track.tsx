"use client";

import { Track } from "@/types/socket";
import { botTokenAtom } from "@/utils/atoms";
import { toTime } from "@/utils/utils";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconArrowUp,
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
  moveTrack,
  playTrack,
  removeTrack,
  skipToTrack,
} from "../actions";
import { withNotification } from "../withNotification";
import classes from "./Track.module.css";

type TrackProps = {
  track: Track;
  index?: number;
  withControls?: boolean;
  hoverable?: boolean;
  small?: boolean;
  transparent?: boolean;
  withPlay?: boolean;
  withAdd?: boolean;
  withRemove?: boolean;
  withMove?: boolean;
  withSkipTo?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export function Track({
  track,
  index,
  withControls,
  hoverable,
  small,
  transparent,
  withPlay,
  withAdd,
  withRemove,
  withMove,
  withSkipTo,
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
      data-small={small}
    >
      {dragHandleProps && (
        <div {...dragHandleProps}>
          <IconGripVertical size={15} />
        </div>
      )}
      {small ? (
        <div className="relative min-w-[40px] min-h-[40px]">
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
          {track && (withControls || withPlay) && (
            <div className="absolute top-[.5rem] left-[.5rem]">
              <Tooltip label={`Play ${track.Title} by ${track.Author}`}>
                <IconPlayerPlayFilled
                  role="button"
                  size="1.5rem"
                  className={classes.playButton}
                  onClick={
                    withSkipTo
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
      ) : (
        <>
          <div className={classes.trackControl}>
            <Tooltip
              label={`${withControls ? "Skip to" : "Play"} ${track?.Title} by ${
                track?.Author
              }`}
            >
              <IconPlayerPlayFilled
                size="1.2rem"
                role="button"
                onClick={
                  withControls
                    ? async () =>
                        withNotification(await skipToTrack(index!, token))
                    : async () =>
                        withNotification(
                          await playTrack(track.Url ?? "", token)
                        )
                }
                className={`${classes.play} ${classes.trackControlPlay}`}
              />
            </Tooltip>
            <Text
              size="0.9rem"
              className={`${classes.index} ${classes.trackIndex} `}
            >
              {index !== undefined ? index + 1 : ""}
            </Text>
          </div>
          <Image
            src={track?.ArtworkUrl ?? "/placeholder-album.png"}
            width={36}
            height={36}
            alt={track.Title}
            className={classes.trackImage}
          />
        </>
      )}

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
      {withControls ? (
        <Group className="ml-auto" gap="xs" wrap="nowrap">
          {withMove && (
            <Tooltip label="Move to top" position="top">
              <ActionIcon
                size={20}
                variant="light"
                color="green"
                aria-label="Move to top"
                onClick={async () =>
                  withNotification(await moveTrack(index!, 0, token))
                }
                className={classes.play}
              >
                <IconArrowUp size={15} />
              </ActionIcon>
            </Tooltip>
          )}
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
                className={classes.play}
              >
                <IconTrash size={13} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ) : withAdd ? (
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
      ) : null}
      <Text
        size="0.8rem"
        className={classes.trackDuration}
        data-left={!withAdd && !withControls}
      >
        {toTime(track?.Duration)}
      </Text>

      {track?.RequestedBy !== null && !small && (
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
      {track?.RequestedBy === null && withSkipTo && (
        <Tooltip label="Autoplay" position="top">
          <IconRefreshDot size={15} />
        </Tooltip>
      )}
    </Group>
  );
}
