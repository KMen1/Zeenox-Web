import { useWindowSize } from "@/components/WindowSizeProvider";
import { Track, TracksResponse } from "@/types/spotify";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Track as TrackComponent } from "../../../components/Track/Track";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { getSearchResults } from "../../../utils/actions";

const ITEM_HEIGHT = 50;

type SearchLazyListProps = {
  query: string;
};

export function SearchLazyList({ query }: SearchLazyListProps) {
  const [response, setResponse] = useState<TracksResponse | null>(null);
  const [items, setItems] = useState<Track[]>([]);
  const windowSize = useWindowSize();
  const height = windowSize[1] - 357;

  async function loadNextPage() {
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await getSearchResults(query, Number(offset));
    setResponse(res?.tracks as unknown as TracksResponse);
    setItems(items.concat(res?.tracks.items ?? []));
  }

  useEffect(() => {
    if (!query) return;
    setResponse(null);
    setItems([]);

    async function fetchSearchResults() {
      const data = await getSearchResults(query);
      setResponse(data?.tracks as unknown as TracksResponse);
      setItems(data?.tracks.items ?? []);
    }

    fetchSearchResults();
  }, [query]);

  const SKELETON_COUNT = Math.floor(height / ITEM_HEIGHT) + 1;

  return response == null ? (
    <div className={`flex flex-col h-[${height}px]`}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TrackSkeleton key={i} />
      ))}
    </div>
  ) : (
    <Virtuoso
      style={{ height }}
      data={items}
      endReached={loadNextPage}
      increaseViewportBy={400}
      itemContent={(_, item) => {
        return (
          <TrackComponent
            hoverable
            track={{
              Id: item.id,
              Title: item.name,
              Author: item.artists.map((artist) => artist.name).join(", "),
              Url: item.external_urls.spotify,
              ArtworkUrl: item.album.images[0].url,
              Duration: item.duration_ms,
              RequestedBy: null,
            }}
            mode="play"
            withAdd
          />
        );
      }}
    />
  );
}
