import { useEffect, useState } from "react";
import { Track as TrackComponent } from "../Track/Track";
import { LazyList } from "./LazyList";
import { Skeleton } from "@mantine/core";
import { SavedTracksResponse, Track } from "@/types/spotify";
import { PayloadType } from "@/types/socket";

const ITEM_HEIGHT = 50;
const LIST_HEIGHT = 435;

export function PlaylistTrackLazyList({ id }: { id: string | null }) {
  const [response, setResponse] = useState<SavedTracksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Track[]>([]);

  async function loadNextPage() {
    setIsLoading(true);
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await fetch(`/api/spotify/playlist/${id}?offset=${offset}`);
    const data = (await res.json()) as SavedTracksResponse;
    setResponse(data);
    setItems(items.concat(data.items.map((item) => item.track)));
    setIsLoading(false);
  }

  useEffect(() => {
    if (id == null) return;
    setResponse(null);
    setItems([]);
    setIsLoading(false);

    async function fetchPlaylist() {
      const res = await fetch(`/api/spotify/playlist/${id}`);
      const data = (await res.json()) as SavedTracksResponse;
      setResponse(data);
      setItems(data.items.map((item) => item.track));
    }

    fetchPlaylist();
  }, [id]);

  const itemFactory = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const track = items[index];
    return (
      <div style={style}>
        <TrackComponent
          index={index}
          hoverable
          track={{
            Type: PayloadType.UpdateTrack,
            Identifier: track.id,
            Title: track.name,
            Author: track.artists.map((artist) => artist.name).join(", "),
            Url: track.external_urls.spotify,
            Thumbnail: track.album.images[0].url,
            Duration: Math.round(track.duration_ms / 1000),
            RequestedBy: {
              Username: "",
              DisplayName: "",
              AvatarUrl: null,
            },
            Lyrics: null,
          }}
          withPlay
          withAdd
        />
      </div>
    );
  };

  const SKELETON_COUNT = Math.floor(LIST_HEIGHT / ITEM_HEIGHT) - 1;

  return response == null ? (
    Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <Skeleton
        key={i}
        w="100%"
        h={ITEM_HEIGHT}
        my={i == 0 || i == SKELETON_COUNT - 1 ? "" : "xs"}
      />
    ))
  ) : (
    <LazyList<Track>
      items={items}
      itemFactory={itemFactory}
      totalCount={response?.total ?? 0}
      loadMoreItems={loadNextPage}
      hasMoreItems={response?.next !== null}
      isLoadingNextPage={isLoading}
      height={LIST_HEIGHT}
      itemHeight={ITEM_HEIGHT}
    />
  );
}
