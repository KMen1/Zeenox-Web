"use client";

import { Stack, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconMenuOrder, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PlaylistLazyList } from "../LazyLoaders/PlaylistLazyList";
import { PlaylistTrackLazyList } from "../LazyLoaders/PlaylistTrackLazyList";
import { SearchLazyList } from "../LazyLoaders/SearchLazyList";
import classes from "./SpotifyPanel.module.css";

export function SpotifyPanel() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("saved");
  const [searchQuery, setSearchQuery] = useDebouncedState("", 2000);

  useEffect(() => {
    if (!searchQuery) return;
    setSelectedPlaylist("search");
  }, [searchQuery]);

  return (
    <Stack gap="xs">
      <TextInput
        placeholder="What do you want to listen to?"
        variant="filled"
        defaultValue={searchQuery}
        leftSection={<IconSearch size="1rem" />}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setSearchQuery(event.currentTarget.value);
            setSelectedPlaylist("search");
          }
        }}
        classNames={{ input: classes.searchInput }}
      />
      <PanelGroup direction="horizontal" autoSaveId="playlists">
        <Panel minSize={30} defaultSize={30} collapsible collapsedSize={8}>
          <Stack gap="xs">
            <PlaylistLazyList
              selected={selectedPlaylist}
              setSelected={setSelectedPlaylist}
            />
          </Stack>
        </Panel>
        <PanelResizeHandle className={classes.resizeHandle}>
          <IconMenuOrder className={classes.resizeIcon} />
        </PanelResizeHandle>
        <Panel minSize={30} defaultSize={70}>
          {selectedPlaylist === "search" ? (
            <SearchLazyList query={searchQuery} />
          ) : (
            <PlaylistTrackLazyList id={selectedPlaylist} />
          )}
        </Panel>
      </PanelGroup>
    </Stack>
  );
}
