import { botTokenAtom } from "@/stores/atoms";
import { AddPlaylistAction } from "@/types/playerActions";
import { PlaylistInfo, Track } from "@/types/socket";
import { Playlist as SpotifyPlaylist } from "@/types/spotify";
import { IconChevronRight, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { Virtuoso } from "react-virtuoso";
import { playTrack } from "../../utils/actions";
import { withNotification } from "../../utils/withNotification";
import { Track as TrackComponent } from "../Track/Track";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PlaylistProps = {
  playlist:
    | AddPlaylistAction
    | SpotifyPlaylist
    | (PlaylistInfo & { Tracks: Track[] });
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

  const url =
    (playlist as AddPlaylistAction)?.Playlist?.Url ||
    (playlist as SpotifyPlaylist)?.external_urls?.spotify ||
    "";
  const name =
    (playlist as AddPlaylistAction)?.Playlist?.Name ||
    (playlist as SpotifyPlaylist)?.name;
  const artworkUrl =
    (playlist as AddPlaylistAction)?.Playlist?.ArtworkUrl ||
    (playlist as PlaylistInfo)?.ArtworkUrl ||
    (playlist as SpotifyPlaylist).images?.at(0)?.url;
  const owner =
    (playlist as AddPlaylistAction)?.Playlist?.Author ||
    (playlist as SpotifyPlaylist)?.owner?.display_name;
  const tracks = (playlist as AddPlaylistAction)?.Tracks;

  return (
    <div
      className={`group flex cursor-pointer flex-nowrap items-center gap-2 rounded p-1.5 hover:bg-white/5 ${
        isSelected ? "bg-white/10" : ""
      } ${transparent ? "hover:bg-[rgba(255,255,255,0.1)]" : ""}`}
      onClick={onClick}
    >
      <div className="relative min-h-[40px] min-w-[40px]">
        <Image
          src={
            artworkUrl || tracks?.[0]?.ArtworkUrl || "/placeholder-album.jpeg"
          }
          width={40}
          height={40}
          alt={name || "Playlist"}
          className="absolute left-0 top-0 h-[40px] w-[40px] rounded group-hover:brightness-50"
        />
        {url ? (
          <div className="absolute left-[.5rem] top-[.5rem]">
            <Tooltip>
              <TooltipTrigger>
                <IconPlayerPlayFilled
                  role="button"
                  size="1.5rem"
                  className="text-white opacity-0 hover:text-neutral-300 group-hover:opacity-100"
                  onClick={async (e) => {
                    e.stopPropagation();
                    withNotification(await playTrack(url, token));
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`Add ${name}`}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <a
          className="line-clamp-1 text-sm font-semibold text-foreground hover:underline"
          target="_blank"
          href={url || "#"}
          title={name || "Playlist"}
        >
          {name || "From previous session"}
        </a>
        <p
          className="line-clamp-1 text-sm text-neutral-400"
          title={owner || "Unknown"}
        >
          {owner || "Unknown"}
        </p>
      </div>

      {expandable ? (
        <Dialog>
          <DialogTrigger className="ml-auto">
            <Button size="icon" variant="ghost">
              <IconChevronRight />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {name} by {owner}
              </DialogTitle>
              <DialogDescription>
                Listing {tracks?.length} songs
              </DialogDescription>
              {tracks?.length > 0 && (
                <Virtuoso
                  style={{ height: "435px" }}
                  width="100%"
                  data={tracks}
                  itemContent={(_, item) => {
                    return (
                      <TrackComponent
                        track={item}
                        hoverable
                        mode="play"
                        withAdd
                      />
                    );
                  }}
                />
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
