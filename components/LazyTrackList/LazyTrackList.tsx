import { SavedTracksResponse, SearchResponse, type Track } from "@/types";
import { useEffect, useState } from "react";
import { Track as TrackComponent } from "../Track/Track";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Box, LoadingOverlay, Skeleton } from "@mantine/core";
import { useAtomValue } from "jotai";
import { actionFetchAtom } from "@/utils/atoms";

export function LazyTrackList({
  id,
  searchQuery,
}: {
  id: string | null;
  searchQuery: string | null;
}) {
  const [playlistResponse, setPlaylistResponse] =
    useState<SavedTracksResponse | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [items, setItems] = useState<Track[]>([]);
  const { addTrack, playTrack } = useAtomValue(actionFetchAtom);

  async function loadNextPage() {
    setIsNextPageLoading(true);
    const nextUrl = playlistResponse?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    if (id === "search") {
      console.log("searching");
      const res = await fetch(
        `/api/spotify/search?q=${searchQuery}&offset=${offset}`
      );
      const data = (await res.json()) as SearchResponse;
      setPlaylistResponse(data.tracks as unknown as SavedTracksResponse);
      setHasNextPage(data.tracks.next !== null);
      setItems(items.concat(data.tracks.items));
      setIsNextPageLoading(false);
      return;
    }
    const res = await fetch(`/api/spotify/playlist/${id}?offset=${offset}`);
    const data = (await res.json()) as SavedTracksResponse;
    setPlaylistResponse(data);
    setHasNextPage(data.next !== null);
    setItems(items.concat(data.items.map((item) => item.track)));
    setIsNextPageLoading(false);
  }

  useEffect(() => {
    if (id == null) return;
    setPlaylistResponse(null);
    setItems([]);
    setHasNextPage(false);
    setIsNextPageLoading(false);

    async function fetchPlaylist() {
      const res = await fetch(`/api/spotify/playlist/${id}`);
      const data = (await res.json()) as SavedTracksResponse;
      setPlaylistResponse(data);
      setHasNextPage(data.next !== null);
      setItems(data.items.map((item) => item.track));
    }

    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    if (!searchQuery) return;
    setPlaylistResponse(null);
    setItems([]);
    setHasNextPage(false);
    setIsNextPageLoading(false);

    async function fetchSearchResults() {
      const res = await fetch(`/api/spotify/search?q=${searchQuery}`);
      const data = (await res.json()) as SearchResponse;
      setPlaylistResponse(data.tracks as unknown as SavedTracksResponse);
      setHasNextPage(data.tracks.next !== null);
      setItems(data.tracks.items);
    }

    fetchSearchResults();
  }, [searchQuery]);

  const itemCount = playlistResponse?.total ?? 0;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <Skeleton w="100%" h={48} />
        </div>
      );
    } else {
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
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={items.length === 0}
        zIndex={1000}
        overlayProps={{ radius: "lg", blur: 2 }}
      />
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            className="List"
            height={420}
            itemCount={itemCount}
            itemSize={50}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width="100%"
          >
            {Item}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </Box>
  );
}
