import { Group, Stack, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import classes from "./Playlist.module.css";
import { Playlist } from "@/types";
import { MouseEventHandler } from "react";
import {
  IconExclamationCircle,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { actionFetchAtom } from "@/utils/atoms";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";

export function Playlist({
  playlist,
  isSelected,
  onClick,
}: {
  playlist: Playlist;
  isSelected?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const { playTrack } = useAtomValue(actionFetchAtom);

  function play() {
    if (!playTrack) return;
    const id = `play-playlist-${playlist.id}-${Date.now()}`;
    showNotification(id, `Queuing ${playlist.name}`, null, true);
    playTrack(playlist.external_urls.spotify).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          `Queued ${playlist.name}`,
          <IconPlayerPlayFilled />,
          "green",
          "Successfully queued playlist!"
        );
      } else {
        updateNotification(
          id,
          `Unable to queue ${playlist.name}`,
          <IconExclamationCircle />,
          "red",
          "Playlist might be empty or unavailable. Make sure playlist is available outside your account."
        );
      }
    });
  }

  return (
    <Group
      role="button"
      gap="xs"
      onClick={onClick}
      wrap="nowrap"
      className={classes.playlist}
      data-selected={isSelected}
    >
      <div className="relative min-w-[40px] min-h-[40px]">
        <Image
          src={playlist.images[0]?.url}
          width={40}
          height={40}
          alt={playlist.name}
          className={classes.playlistImage}
        />
        <div className="absolute top-[.5rem] left-[.5rem]">
          <Tooltip label={`Queue ${playlist.name}`}>
            <IconPlayerPlayFilled
              role="button"
              size="1.5rem"
              className={classes.playlistPlay}
              onClick={(e) => {
                e.stopPropagation();
                play();
              }}
            />
          </Tooltip>
        </div>
      </div>

      <Stack gap={0}>
        <Text
          size="sm"
          lineClamp={1}
          lh={1.4}
          component="a"
          target="_blank"
          href={playlist.external_urls.spotify}
          className={classes.playlistTitle}
        >
          {playlist.name}
        </Text>
        <Text size="sm" lineClamp={1} lh={1.4}>
          {playlist.owner.display_name}
        </Text>
      </Stack>
    </Group>
  );
}
