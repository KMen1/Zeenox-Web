"use client";

import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconArrowUp,
  IconGripVertical,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "./Track.module.css";
import { toTime } from "@/utils/utils";
import { Track } from "@/types/socket";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useAdd, useMove, usePlay, useRemove, useSkipTo } from "../hooks";

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
}: {
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
}) {
  const play = usePlay();
  const add = useAdd();
  const remove = useRemove();
  const move = useMove();
  const skipTo = useSkipTo();

  const onPlay = withPlay ? play : null;
  const onAdd = withAdd ? add : null;
  const onRemove = withRemove ? remove : null;
  const onMove = withMove ? move : null;
  const onSkipTo = withSkipTo ? skipTo : null;

  return (
    <Group
      align="center"
      gap="sm"
      wrap="nowrap"
      className={classes.track}
      onDoubleClick={
        withControls
          ? () => skipTo(track.Title, index!)
          : () => add(track.Title, track.Url)
      }
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
              track?.Thumbnail ??
              "https://misc.scdn.co/liked-songs/liked-songs-640.png"
            }
            width={36}
            height={36}
            className={classes.thumbnail}
            alt={track?.Title ?? "Nothing here"}
          />
          {track && (withControls || onPlay) && (
            <div className="absolute top-[.5rem] left-[.5rem]">
              <Tooltip label={`Play ${track.Title} by ${track.Author}`}>
                <IconPlayerPlayFilled
                  role="button"
                  size="1.5rem"
                  className={classes.playButton}
                  onClick={
                    onSkipTo
                      ? () => skipTo(track.Title, index!)
                      : () => play(track.Title, track.Url!)
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
                    ? () => skipTo(track.Title, index!)
                    : () => play(track.Title, track.Url!)
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
            src={track?.Thumbnail ?? "/placeholder-album.png"}
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
          {onMove && (
            <Tooltip label="Move to top" position="top">
              <ActionIcon
                size={20}
                variant="light"
                color="green"
                aria-label="Move to top"
                onClick={() => move(index!, 0)}
                className={classes.play}
              >
                <IconArrowUp size={15} />
              </ActionIcon>
            </Tooltip>
          )}
          {onRemove && (
            <Tooltip label="Remove from queue" position="top">
              <ActionIcon
                size={20}
                variant="light"
                color="red"
                aria-label="Remove Track"
                onClick={() => remove(track.Title, index!)}
                className={classes.play}
              >
                <IconTrash size={13} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ) : onAdd ? (
        <Tooltip label="Add to queue" position="top">
          <ActionIcon
            size={20}
            variant="light"
            color="dark.1"
            aria-label="Add to queue"
            onClick={() => add(track.Title, track.Url)}
            className="ml-auto"
          >
            <IconPlaylistAdd size={15} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      <Text
        size="0.8rem"
        className={classes.trackDuration}
        data-left={!onAdd && !withControls}
      >
        {toTime(track?.Duration)}
      </Text>

      {track?.RequestedBy.AvatarUrl && !small && (
        <Tooltip label={track?.RequestedBy.DisplayName} position="top">
          <Image
            src={track?.RequestedBy.AvatarUrl}
            width={20}
            height={20}
            alt={track?.RequestedBy.DisplayName}
            style={{ borderRadius: "50%" }}
          />
        </Tooltip>
      )}
    </Group>
  );
}
