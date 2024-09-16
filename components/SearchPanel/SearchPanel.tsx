"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
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
import { searchTracks } from "../../utils/actions";
import { Playlist } from "../Playlist/Playlist";
import { Track as TrackComponent } from "../Track/Track";
import { TrackSkeleton } from "../Track/TrackSkeleton";

type SearchPanelFormProps = {
  state: SearchResult | null;
};

function SearchPanelForm({ state }: SearchPanelFormProps) {
  const { pending } = useFormStatus();
  const playlist = state?.Playlist;

  return (
    <div className={`flex flex-col gap-2`}>
      <Input
        name="query"
        placeholder="What do you want to listen to?"
        disabled={pending}
      />
      {!state && !pending && (
        <Center className="p-4">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">
              Start searching and results will appear here!
            </p>
          </div>
        </Center>
      )}
      {pending && (
        <div className={`flex flex-col`}>
          {Array.from({ length: 1 }).map((_, i) => (
            <TrackSkeleton key={i} />
          ))}
        </div>
      )}
      {state?.Tracks.length === 0 && (
        <Center className="p-4">
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
          style={{ height: "100%" }}
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

export function SearchPanel({
  isSpotifyEnabled,
}: {
  isSpotifyEnabled: boolean;
}) {
  const [state, formAction] = useFormState(searchTracks, null);

  return (
    <ContentCard
      title={"Search for a song"}
      icon={<IconListSearch />}
      rightSection={
        isSpotifyEnabled ? (
          <Button asChild className="h-7">
            <a href="/api/login/spotify">
              <div className="flex items-center gap-2">
                <IconBrandSpotify size={20} />
                Connect Spotify
              </div>
            </a>
          </Button>
        ) : null
      }
    >
      <form action={formAction}>
        <SearchPanelForm state={state} />
      </form>
    </ContentCard>
  );
}
