"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { useWindowSize } from "@/components/WindowSizeProvider";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Input } from "@/components/ui/input";
import { SearchResult } from "@/types/socket";
import {
  IconBrandSpotify,
  IconListSearch,
  IconMoodSad,
} from "@tabler/icons-react";
import { useFormState, useFormStatus } from "react-dom";
import { Virtuoso } from "react-virtuoso";
import { Playlist } from "../../../components/Playlist/Playlist";
import { Track as TrackComponent } from "../../../components/Track/Track";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { searchTracks } from "../../../utils/actions";

type SearchPanelFormProps = {
  state: SearchResult | null;
};

function SearchPanelForm({ state }: SearchPanelFormProps) {
  const windowSize = useWindowSize();
  const height = windowSize[1] - 342;
  const { pending } = useFormStatus();
  const SKELETON_COUNT = height / 50 - 1;
  const playlist = state?.Playlist;

  return (
    <div className={`flex flex-col gap-2 h-[${height}]`}>
      <Input
        name="query"
        placeholder="What do you want to listen to?"
        disabled={pending}
      />
      {!state && !pending && (
        <Center height={height} className="p-4">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">
              Start searching and results will appear here!
            </p>
          </div>
        </Center>
      )}
      {pending && (
        <div className={`flex flex-col h-[${height}]`}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <TrackSkeleton key={i} />
          ))}
        </div>
      )}
      {state?.Tracks.length === 0 && (
        <Center height={height} className="p-4">
          <div className="flex flex-col items-center">
            <IconMoodSad size={100} />
            <p className="text-xl font-bold">No Results Found</p>
          </div>
        </Center>
      )}
      {playlist && (
        <Playlist
          playlist={{
            Name: playlist.Name,
            ArtworkUrl: playlist.ArtworkUrl,
            Tracks: state.Tracks,
            Url: playlist.Url,
            Author: playlist.Author,
          }}
          expandable
        />
      )}
      {!playlist && state?.Tracks && state.Tracks.length > 0 && (
        <Virtuoso
          style={{ height }}
          data={state?.Tracks || []}
          itemContent={(_, item) => {
            return (
              <TrackComponent
                key={item.Id}
                track={item}
                mode="play"
                withAdd
                hoverable
              />
            );
          }}
        />
      )}
    </div>
  );
}

export function SearchPanel() {
  const [state, formAction] = useFormState(searchTracks, null);

  return (
    <ContentCard
      title={"Search for a song"}
      icon={<IconListSearch />}
      rightSection={
        <Button asChild className="h-7">
          <a href="/api/login/spotify">
            <div className="flex items-center gap-2">
              <IconBrandSpotify size={20} />
              Connect Spotify
            </div>
          </a>
        </Button>
      }
    >
      <form action={formAction}>
        <SearchPanelForm state={state} />
      </form>
    </ContentCard>
  );
}
