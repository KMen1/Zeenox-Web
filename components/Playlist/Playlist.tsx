import { AddPlaylistAction } from "@/features/actions-panel";
import { botTokenAtom } from "@/stores/atoms";
import { PlaylistInfo, Track } from "@/types/socket";
import { Playlist } from "@/types/spotify";
import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { playTrack } from "../../utils/actions";
import { withNotification } from "../../utils/withNotification";
import classes from "./Playlist.module.css";
import { PlaylistModal } from "./PlaylistModal";

type PlaylistProps = {
  playlist: AddPlaylistAction | Playlist | (PlaylistInfo & { Tracks: Track[] });
  isSelected?: boolean;
  transparent?: boolean;
  expandable?: boolean;
  onClick?: () => void;
};

export function Playlist({
  playlist,
  isSelected,
  transparent,
  expandable,
  onClick,
}: PlaylistProps) {
  const token = useAtomValue(botTokenAtom);
  const [opened, { open, close }] = useDisclosure(false);

  const url =
    (playlist as AddPlaylistAction)?.Playlist?.Url ||
    (playlist as Playlist)?.external_urls?.spotify ||
    "";
  const name =
    (playlist as AddPlaylistAction)?.Playlist?.Name ||
    (playlist as Playlist)?.name;
  const artworkUrl =
    (playlist as AddPlaylistAction)?.Playlist?.ArtworkUrl ||
    (playlist as PlaylistInfo)?.ArtworkUrl ||
    (playlist as Playlist).images?.at(0)?.url;
  const owner =
    (playlist as AddPlaylistAction)?.Playlist?.Author ||
    (playlist as Playlist)?.owner?.display_name;
  const tracks = (playlist as AddPlaylistAction)?.Tracks;

  return (
    <>
      {expandable ? (
        <PlaylistModal
          opened={opened}
          onClose={close}
          name={name}
          tracks={tracks}
        />
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
            src={
              artworkUrl || tracks?.[0]?.ArtworkUrl || "/placeholder-album.jpeg"
            }
            width={40}
            height={40}
            alt={name || "Playlist"}
            className={classes.playlistImage}
          />
          {url ? (
            <div className="absolute top-[.5rem] left-[.5rem]">
              <Tooltip label={`Add ${name}`}>
                <IconPlayerPlayFilled
                  role="button"
                  size="1.5rem"
                  className={classes.playlistPlay}
                  onClick={async (e) => {
                    e.stopPropagation();
                    withNotification(await playTrack(url, token));
                  }}
                />
              </Tooltip>
            </div>
          ) : null}
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
            {name || "Resume Session"}
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
          <ActionIcon
            className="ml-auto"
            variant="light"
            color="dark.1"
            onClick={open}
          >
            <IconChevronRight />
          </ActionIcon>
        ) : null}
      </Group>
    </>
  );
}
