"use client";

import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconArrowUp,
  IconExclamationCircle,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "./Track.module.css";
import { getErrorMessageFromCode, toTime } from "@/utils/utils";
import { ActionResult, TrackData } from "@/types";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";

export function Track({
  track,
  index,
  withControls,
  small,
  transparent,
  onPlay,
  onAdd,
  onRemove,
  onMove,
  onSkipTo,
}: {
  track: TrackData;
  index?: number;
  withControls?: boolean;
  small?: boolean;
  transparent?: boolean;
  onPlay?: (url: string) => Promise<ActionResult>;
  onAdd?: (url: string) => Promise<ActionResult>;
  onRemove?: (index: number) => Promise<ActionResult>;
  onMove?: (from: number, to: number) => Promise<ActionResult>;
  onSkipTo?: (index: number) => Promise<ActionResult>;
}) {
  function play() {
    if (!onPlay) return;
    const id = `play-track-${track.Identifier}-${Date.now()}`;
    showNotification(id, `Playing ${track.Title}`, null, true);
    onPlay(track.Url!).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Playing ${track.Title}`,
          <IconPlayerPlayFilled />,
          "green",
          "Successfully played track!"
        );
      } else {
        updateNotification(
          id,
          `Unable to play ${track.Title}`,
          <IconExclamationCircle />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function add() {
    if (!onAdd) return;
    const id = `add-track-${track.Identifier}-${Date.now()}`;
    showNotification(id, `Adding ${track.Title} to queue`, null, true);
    onAdd(track.Url!).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Added ${track.Title} to queue`,
          <IconPlaylistAdd />,
          "green",
          "Successfully added to queue!"
        );
      } else {
        updateNotification(
          id,
          `Unable to add ${track.Title} to queue`,
          <IconExclamationCircle />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function skipTo() {
    if (!onSkipTo) return;
    const id = `skip-to-track-${track.Identifier}-${Date.now()}`;
    showNotification(id, `Skipping to ${track.Title}`, null, true);
    onSkipTo(index!).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Skipped to ${track.Title}`,
          <IconPlayerPlayFilled />,
          "green",
          "Successfully skipped to track!"
        );
      } else {
        updateNotification(
          id,
          `Unable to skip to ${track.Title}`,
          <IconExclamationCircle />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function remove() {
    if (!onRemove) return;
    const id = `remove-track-${track.Identifier}-${Date.now()}`;
    showNotification(id, `Removing ${track.Title} from queue`, null, true);
    onRemove(index!).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Removed ${track.Title} from queue`,
          <IconTrash />,
          "green",
          "Successfully removed from queue!"
        );
      } else {
        updateNotification(
          id,
          `Unable to remove ${track.Title} from queue`,
          <IconExclamationCircle />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function moveToTop() {
    if (!onMove || !index) return;
    const id = `move-track-${track.Identifier}-${Date.now()}`;
    showNotification(id, `Moving ${track.Title} to top of queue`, null, true);
    onMove(index, 0).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Moved ${track.Title} to top of queue`,
          <IconArrowUp />,
          "green",
          "Successfully moved to top of queue!"
        );
      } else {
        updateNotification(
          id,
          `Unable to move ${track.Title} to top of queue`,
          <IconExclamationCircle />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  if (small) {
    return (
      <Group
        gap={10}
        className={classes.smallTrack}
        wrap="nowrap"
        data-transparent={transparent == true}
      >
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
          {track && (
            <div className="absolute top-[.5rem] left-[.5rem]">
              <Tooltip label={`Play ${track.Title} by ${track.Author}`}>
                <IconPlayerPlayFilled
                  role="button"
                  size="1.5rem"
                  className={classes.playButton}
                  onClick={onSkipTo ? skipTo : play}
                />
              </Tooltip>
            </div>
          )}
        </div>
        <Stack gap={1}>
          <Text
            size="0.9rem"
            lineClamp={1}
            lh={1.3}
            component="a"
            href={track?.Url!}
            target="_blank"
            className={classes.title}
            c={transparent ? "white" : undefined}
          >
            {track?.Title ?? "Nothing here"}
          </Text>
          <Text
            size="0.8rem"
            lineClamp={1}
            lh={1.3}
            c={transparent ? "gray.3" : undefined}
          >
            {track?.Author ?? "Add songs"}
          </Text>
        </Stack>
        <Text
          size="0.8rem"
          lineClamp={1}
          lh={1.3}
          ml="auto"
          c={transparent ? "gray.3" : undefined}
        >
          {toTime(track?.Duration)}
        </Text>
      </Group>
    );
  }

  return (
    <Group
      align="center"
      gap="sm"
      wrap="nowrap"
      className={classes.track}
      onDoubleClick={withControls ? skipTo : add}
    >
      <div className={classes.trackControl}>
        <Tooltip
          label={`${withControls ? "Skip to" : "Play"} ${track?.Title} by ${
            track?.Author
          }`}
        >
          <IconPlayerPlayFilled
            size="1.2rem"
            role="button"
            onClick={withControls ? skipTo : play}
            className={`${classes.play} ${classes.trackControlPlay}`}
          />
        </Tooltip>
        <Text
          size="0.9rem"
          className={`${classes.index} ${classes.trackIndex} `}
        >
          {index! + 1}
        </Text>
      </div>
      <Image
        src={track.Thumbnail ?? "/placeholder-album.png"}
        width={36}
        height={36}
        alt={track.Title}
        className={classes.trackImage}
      />
      <Stack gap={0}>
        <Text
          size="0.9rem"
          lineClamp={1}
          lh={1.4}
          component="a"
          href={track.Url!}
          target="_blank"
          className={classes.trackTitle}
        >
          {track.Title}
        </Text>
        <Text size="0.8rem" lineClamp={1} lh={1.4}>
          {track.Author}
        </Text>
      </Stack>
      {withControls && (
        <Group className={classes.trackQueueControl} gap={0}>
          <Tooltip label="Move to top" position="top">
            <ActionIcon
              variant="transparent"
              color="green"
              aria-label="Move to top"
              onClick={moveToTop}
              className={`${classes.play} ${classes.trackMoveToTop} `}
            >
              <IconArrowUp size="1.2rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remove from queue" position="top">
            <ActionIcon
              variant="transparent"
              color="red"
              aria-label="Remove Track"
              onClick={remove}
              className={`${classes.play} ${classes.trackQueueControl} `}
            >
              <IconTrash size="1.2rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
      {!withControls && (
        <Tooltip label="Add to queue" position="top">
          <ActionIcon
            variant="transparent"
            color="dark.2"
            aria-label="Remove Track"
            onClick={add}
            className={classes.trackMoveToTop}
          >
            <IconPlaylistAdd size="1.2rem" />
          </ActionIcon>
        </Tooltip>
      )}
      <Text size="0.9rem" className={classes.trackDuration}>
        {toTime(track.Duration)}
      </Text>

      {track.RequestedBy.AvatarUrl && (
        <Tooltip label={track.RequestedBy.DisplayName} position="top">
          <Image
            src={track.RequestedBy.AvatarUrl}
            width={20}
            height={20}
            alt={track.RequestedBy.DisplayName}
            style={{ borderRadius: "50%" }}
          />
        </Tooltip>
      )}
    </Group>
  );
}
