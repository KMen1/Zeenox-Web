import { Track, TracksResponse } from "@/types/spotify";
import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { LazyList } from "../../../components/LazyLoaders/LazyList";
import { Track as TrackComponent } from "../../../components/Track/Track";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { useSize } from "../../../hooks/useSize";
import { getPlaylistTracks } from "../../../utils/actions";

const ITEM_HEIGHT = 50;

type PlaylistTrackLazyListProps = {
  id: string;
};

export function PlaylistTrackLazyList({ id }: PlaylistTrackLazyListProps) {
  const [response, setResponse] = useState<TracksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Track[]>([]);
  const windowSize = useSize();
  const height = windowSize[1] - 357;

  async function loadNextPage() {
    setIsLoading(true);
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await getPlaylistTracks(id, Number(offset));
    setResponse(res);
    setItems(items.concat(res?.items.map((item) => item.track) ?? []));
    setIsLoading(false);
  }

  useEffect(() => {
    if (id == null) return;
    setResponse(null);
    setItems([]);
    setIsLoading(false);

    async function fetchPlaylist() {
      const data = await getPlaylistTracks(id);
      setResponse(data);
      setItems(data?.items.map((item) => item.track) ?? []);
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
            Id: track.id,
            Title: track.name,
            Author: track.artists.map((artist) => artist.name).join(", "),
            Url: track.external_urls.spotify,
            ArtworkUrl: track.album.images[0].url,
            Duration: track.duration_ms,
            RequestedBy: null,
          }}
          mode="play"
          withAdd
        />
      </div>
    );
  };

  const SKELETON_COUNT = Math.floor(height / ITEM_HEIGHT) + 1;

  return response == null ? (
    <Stack gap={0} style={{ height }}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TrackSkeleton key={i} />
      ))}
    </Stack>
  ) : (
    <LazyList<Track>
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
