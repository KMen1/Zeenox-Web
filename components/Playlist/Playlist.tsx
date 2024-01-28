import { Group, Tooltip, Stack, ActionIcon, Text, Modal } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconChevronRight,
  IconPlaylist,
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "./Playlist.module.css";
import { useDisclosure } from "@mantine/hooks";
import { Track as TrackComponent } from "../Track/Track";
import { AddPlaylistPayload, Track } from "@/types/socket";
import { MemoizedList } from "../MemoizedList/MemoizedList";
import { Playlist } from "@/types/spotify";
import { usePlay } from "../hooks";

export function Playlist({
  playlist,
  isSelected,
  transparent,
  expandable,
  onClick,
}: {
  playlist: AddPlaylistPayload | Playlist;
  isSelected?: boolean;
  transparent?: boolean;
  expandable?: boolean;
  onClick?: () => void;
}) {
  const play = usePlay();
  const [opened, { open, close }] = useDisclosure(false);

  const url =
    (playlist as AddPlaylistPayload).Url ||
    (playlist as Playlist).external_urls.spotify;
  const name =
    (playlist as AddPlaylistPayload).Name || (playlist as Playlist).name;
  const artworkUrl =
    (playlist as AddPlaylistPayload).ArtworkUrl ||
    (playlist as Playlist).images[0].url;
  const owner =
    (playlist as AddPlaylistPayload).Author ||
    (playlist as Playlist).owner.display_name;
  const tracks = (playlist as AddPlaylistPayload).Tracks;

  return (
    <>
      {expandable ? (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Group gap="xs">
              <Text>
                <IconPlaylist size={30} />
              </Text>
              <Text fw={700}>{name || "Playlist"}</Text>
            </Group>
          }
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          classNames={{
            content: classes.content,
          }}
        >
          <Stack gap="xs" className={classes.infoGroup}>
            <Text fw={600}>Listing {tracks.length} songs</Text>
            <MemoizedList<Track>
              height={435}
              width="100%"
              items={tracks}
              itemHeight={50}
              renderItem={(item) => {
                return (
                  <TrackComponent
                    track={item}
                    small
                    hoverable
                    withPlay
                    withAdd
                  />
                );
              }}
            />
          </Stack>
        </Modal>
      ) : null}

      <Group
        gap="xs"
        wrap="nowrap"
        className={classes.playlist}
        data-transparent={transparent}
        data-selected={isSelected}
        onClick={onClick}
      >
        <div className="relative min-w-[40px] min-h-[40px]">
          <Image
            src={artworkUrl || "/placeholder-album.jpeg"}
            width={40}
            height={40}
            alt={name || "Playlist"}
            className={classes.playlistImage}
          />
          <div className="absolute top-[.5rem] left-[.5rem]">
            <Tooltip label={`Queue ${name}`}>
              <IconPlayerPlayFilled
                role="button"
                size="1.5rem"
                className={classes.playlistPlay}
                onClick={(e) => {
                  e.stopPropagation();
                  play(name, url, true);
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
            href={url || "#"}
            title={name || "Playlist"}
            className={classes.playlistTitle}
          >
            {name || "Playlist"}
          </Text>
          <Text
            size="sm"
            lineClamp={1}
            lh={1.4}
            title={owner || "Unknown"}
            className={classes.playlistOwner}
          >
            {owner || "Unknown"}
          </Text>
        </Stack>

        {expandable ? (
          <ActionIcon className="ml-auto" variant="light" onClick={open}>
            <IconChevronRight />
          </ActionIcon>
        ) : null}
      </Group>
    </>
  );
}
