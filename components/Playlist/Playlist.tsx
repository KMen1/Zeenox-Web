import { Group, Stack, Text } from "@mantine/core";
import Image from "next/image";
import classes from "./Playlist.module.css";
import { Playlist } from "@/types";
import { MouseEventHandler, useCallback, useEffect } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useActions } from "../Providers/ActionProvider";

export function Playlist({
  playlist,
  isSelected,
  onClick,
}: {
  playlist: Playlist;
  isSelected?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const { playTrack } = useActions();

  function play() {
    playTrack(playlist.external_urls.spotify);
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
          src={playlist.images[0].url}
          width={40}
          height={40}
          alt={playlist.name}
          className={classes.playlistImage}
        />
        <div className="absolute top-[.5rem] left-[.5rem]">
          <IconPlayerPlayFilled
            role="button"
            size="1.5rem"
            className={classes.playlistPlay}
            onClick={(e) => {
              e.stopPropagation();
              play();
            }}
          />
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
