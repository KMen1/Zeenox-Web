import { PlaylistSkeleton } from "@/components/Playlist/PlaylistSkeleton";
import {
  ItemType,
  OwnerType,
  Playlist,
  PlaylistsResponse,
} from "@/types/spotify";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Playlist as PlaylistComponent } from "../../../components/Playlist/Playlist";
import { getPlaylists } from "../../../utils/actions";

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

const ITEM_HEIGHT = 52;

type PlaylistSelectorProps = {
  selected: string | null;
  setSelected: Dispatch<SetStateAction<string>>;
};

export function PlaylistSelector({
  selected,
  setSelected,
}: PlaylistSelectorProps) {
  const [response, setResponse] = useState<PlaylistsResponse | null>(null);
  const [items, setItems] = useState<Playlist[]>([SAVED]);

  async function loadNextPage() {
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await getPlaylists(Number(offset));
    setResponse(res);
    setItems(items.concat(res?.items ?? []));
  }

  useEffect(() => {
    setResponse(null);

    async function fetchPlaylist() {
      const data = await getPlaylists();
      setResponse(data);
      setItems((i) => i.concat(data?.items ?? []));
    }

    fetchPlaylist();
  }, []);

  //const SKELETON_COUNT = Math.floor(height / ITEM_HEIGHT) + 1;

  return response == null ? (
    <div className={`flex flex-col`}>
      {Array.from({ length: 1 }).map((_, i) => (
        <PlaylistSkeleton key={i} />
      ))}
    </div>
  ) : (
    <Virtuoso
      style={{ height: "100%" }}
      data={items}
      endReached={loadNextPage}
      increaseViewportBy={400}
      itemContent={(_, item) => {
        return (
          <PlaylistComponent
            playlist={item}
            isSelected={selected === item.id}
            onClick={() => setSelected(item.id)}
          />
        );
      }}
    />
  );
}
