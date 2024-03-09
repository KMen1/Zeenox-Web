import { PlaylistSkeleton } from "@/components/Playlist/PlaylistSkeleton";
import {
  ItemType,
  OwnerType,
  Playlist,
  PlaylistsResponse,
} from "@/types/spotify";
import { Stack } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LazyList } from "../../../components/LazyLoaders/LazyList";
import { Playlist as PlaylistComponent } from "../../../components/Playlist/Playlist";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { useSize } from "../../../hooks/useSize";
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

export function PlaylistLazyList({
  selected,
  setSelected,
}: PlaylistSelectorProps) {
  const [response, setResponse] = useState<PlaylistsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Playlist[]>([SAVED]);
  const windowSize = useSize();
  const height = windowSize[1] - 357;

  async function loadNextPage() {
    setIsLoading(true);
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await getPlaylists(Number(offset));
    setResponse(res);
    setItems(items.concat(res?.items ?? []));
    setIsLoading(false);
  }

  useEffect(() => {
    setResponse(null);
    setIsLoading(false);

    async function fetchPlaylist() {
      const data = await getPlaylists();
      setResponse(data);
      setItems((i) => i.concat(data?.items ?? []));
    }

    fetchPlaylist();
  }, []);

  const itemFactory = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const playlist = items[index];
    return (
      <div style={style}>
        <PlaylistComponent
          playlist={playlist}
          isSelected={selected === playlist.id}
          onClick={() => setSelected(playlist.id)}
        />
      </div>
    );
  };

  const SKELETON_COUNT = Math.floor(height / ITEM_HEIGHT) + 1;

  return response == null ? (
    <Stack gap={0} style={{ height }}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <PlaylistSkeleton key={i} />
      ))}
    </Stack>
  ) : (
    <LazyList<Playlist>
      items={items}
      itemFactory={itemFactory}
      totalCount={response?.total ?? 0}
      loadMoreItems={loadNextPage}
      hasMoreItems={response?.next !== null}
      isLoadingNextPage={isLoading}
      height={height}
      itemHeight={ITEM_HEIGHT}
      skeleton={<TrackSkeleton />}
    />
  );
}
