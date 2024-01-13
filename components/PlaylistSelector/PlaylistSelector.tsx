import { ItemType, OwnerType, Playlist as Playlist } from "@/types";
import { ScrollArea } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { Playlist as PlaylistComponent } from "../Playlist/Playlist";

const SAVED = {
  collaborative: false,
  description: "",
  external_urls: {
    spotify: "",
  },
  href: "",
  id: "saved",
  images: [
    {
      height: 640,
      url: "https://misc.scdn.co/liked-songs/liked-songs-640.png",
      width: 640,
    },
  ],
  name: "Liked Songs",
  owner: {
    display_name: "You",
    external_urls: { spotify: "" },
    href: "",
    id: "",
    type: OwnerType.User,
    uri: "",
  },
  primary_color: null,
  public: false,
  snapshot_id: "",
  tracks: {
    href: "",
    total: 0,
  },
  type: ItemType.Playlist,
  uri: "",
};

export function PlaylistSelector({
  selected,
  setSelected,
  playlists,
}: {
  selected: string | null;
  setSelected: Dispatch<SetStateAction<string | null>>;
  playlists: Playlist[] | null;
}) {
  return (
    <ScrollArea h={380}>
      <PlaylistComponent
        playlist={SAVED}
        isSelected={selected === "saved"}
        onClick={() => setSelected("saved")}
      />
      {playlists?.map((playlist) => (
        <PlaylistComponent
          key={playlist.id}
          playlist={playlist}
          isSelected={playlist.id === selected}
          onClick={() => setSelected(playlist.id)}
        />
      ))}
    </ScrollArea>
  );
}
