import { Track, TracksResponse } from "@/types/spotify";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { getPlaylistTracks } from "../../utils/actions";
import { Track as TrackComponent } from "../Track/Track";
import { TrackSkeleton } from "../Track/TrackSkeleton";

type PlaylistTrackLazyListProps = {
  id: string;
};

export function PlaylistTrackLazyList({ id }: PlaylistTrackLazyListProps) {
  const [response, setResponse] = useState<TracksResponse | null>(null);
  const [items, setItems] = useState<Track[]>([]);

  async function loadNextPage() {
    const nextUrl = response?.next;
    if (nextUrl == null) return;
    const offset = new URL(nextUrl).searchParams.get("offset");
    const res = await getPlaylistTracks(id, Number(offset));
    setResponse(res);
    setItems(items.concat(res?.items.map((item) => item.track) ?? []));
  }

  useEffect(() => {
    if (id == null) return;
    setResponse(null);
    setItems([]);

    async function fetchPlaylist() {
      const data = await getPlaylistTracks(id);
      setResponse(data);
      setItems(data?.items.map((item) => item.track) ?? []);
    }

    fetchPlaylist();
  }, [id]);

  //const SKELETON_COUNT = Math.floor(height / ITEM_HEIGHT) + 1;

  return response == null ? (
    <div className={`flex flex-col`}>
      {Array.from({ length: 1 }).map((_, i) => (
        <TrackSkeleton key={i} />
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
