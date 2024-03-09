"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { SearchResult, Track } from "@/types/socket";
import { Center, Stack, Text, TextInput } from "@mantine/core";
import { IconListSearch, IconMoodSad, IconSearch } from "@tabler/icons-react";
import { useFormState, useFormStatus } from "react-dom";
import { MemoizedList } from "../../../components/MemoizedList/MemoizedList";
import { Playlist } from "../../../components/Playlist/Playlist";
import { Track as TrackComponent } from "../../../components/Track/Track";
import { TrackSkeleton } from "../../../components/Track/TrackSkeleton";
import { useSize } from "../../../hooks/useSize";
import { searchTracks } from "../../../utils/actions";

type SearchPanelFormProps = {
  state: SearchResult | null;
};

function SearchPanelForm({ state }: SearchPanelFormProps) {
  const windowSize = useSize();
  const height = windowSize[1] - 357;
  const { pending } = useFormStatus();
  const SKELETON_COUNT = height / 50 - 1;
  const playlist = state?.Playlist;

  return (
    <Stack gap="xs" h={height + 46}>
      <TextInput
        name="query"
        placeholder="What do you want to listen to?"
        variant="filled"
        leftSection={<IconSearch size="1rem" />}
        disabled={pending}
      />
      {!state && !pending && (
        <Center h={height} p="xl">
          <Stack gap={0} align="center">
            <Text fw={700} size="xl">
              Start searching and results will appear here!
            </Text>
          </Stack>
        </Center>
      )}
      {pending && (
        <Stack gap={0} style={{ height }}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <TrackSkeleton key={i} />
          ))}
        </Stack>
      )}
      {state?.Tracks.length === 0 && (
        <Center h={height} p="xl">
          <Stack gap={0} align="center">
            <IconMoodSad size={100} />
            <Text fw={700} size="xl">
              No Results Found
            </Text>
          </Stack>
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
        <MemoizedList<Track>
          items={state?.Tracks || []}
          height={height}
          width={"100%"}
          itemHeight={50}
          renderItem={function (item: Track, index: number) {
            return (
              <TrackComponent
                index={index}
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
    </Stack>
  );
}

export function SearchPanel() {
  const [state, formAction] = useFormState(searchTracks, null);

  return (
    <ContentCard title={"Search for a song"} icon={<IconListSearch />}>
      <form action={formAction}>
        <SearchPanelForm state={state} />
      </form>
    </ContentCard>
  );
}
