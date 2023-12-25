import { SavedTracksResponse, SearchResponse, type Track } from "@/types";
import { useEffect, useState } from "react";
import { Track as TrackComponent } from "../Track/Track";
import { useAtomValue } from "jotai";
import { actionFetchAtom } from "@/utils/atoms";
import { LazyList } from "./LazyList";
import { Skeleton } from "@mantine/core";

const ITEM_HEIGHT = 50;
const LIST_HEIGHT = 425;

export function SearchLazyList({ query }: { query: string | null }) {
  const [response, setResponse] = useState<SavedTracksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Track[]>([]);
  const { addTrack, playTrack } = useAtomValue(actionFetchAtom);

  async function loadNextPage() {
    setIsLoading(true);
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await fetch(`/api/spotify/search?q=${query}&offset=${offset}`);
    const data = (await res.json()) as SearchResponse;
    setResponse(data.tracks as unknown as SavedTracksResponse);
    setItems(items.concat(data.tracks.items));
    setIsLoading(false);
  }

  useEffect(() => {
    if (!query) return;
    setResponse(null);
    setItems([]);
    setIsLoading(false);

    async function fetchSearchResults() {
      const res = await fetch(`/api/spotify/search?q=${query}`);
      const data = (await res.json()) as SearchResponse;
      setResponse(data.tracks as unknown as SavedTracksResponse);
      setItems(data.tracks.items);
    }

    fetchSearchResults();
  }, [query]);

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
          track={{
            Type: "player-track",
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
          }}
          onPlay={playTrack}
          onAdd={addTrack}
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
