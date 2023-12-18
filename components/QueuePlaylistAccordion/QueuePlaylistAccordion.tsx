"use client";

import { Accordion, Group, Stack, Text, TextInput } from "@mantine/core";
import {
  IconBrandSpotify,
  IconMenuOrder,
  IconPlaylist,
} from "@tabler/icons-react";
import { Queue } from "../Queue/Queue";
import { useCallback, useEffect, useState } from "react";
import classes from "./QueuePlaylistAccordion.module.css";
import { Playlist } from "@/types";
import { PlaylistSelector } from "../PlaylistSelector/PlaylistSelector";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toHumanTime } from "@/utils/utils";
import { useDebouncedState } from "@mantine/hooks";
import { LazyTrackList } from "../LazyTrackList/LazyTrackList";
import { useAtomValue } from "jotai";
import { queueAtom } from "@/utils/atoms";

export function QueuePlaylistAccordion({
  playlists,
  spotifyConnected,
}: {
  playlists: Playlist[] | null;
  spotifyConnected: boolean;
}) {
  const [value, setValue] = useState("queue");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
    "saved"
  );
  const [searchQuery, setSearchQuery] = useDebouncedState("", 1000);
  const tracks = useAtomValue(queueAtom);

  function getQueueLength() {
    if (tracks === null) return null;
    if (tracks.length === 0) return null;
    return `${tracks.length} ${
      tracks.length === 1 ? "song" : "songs"
    }, ${toHumanTime(
      tracks.map((t) => t.Duration).reduce((a, b) => a + b, 0)
    )}`;
  }

  useEffect(() => {
    if (!searchQuery) return;
    setSelectedPlaylist("search");
  }, [searchQuery]);

  const handleChange = useCallback(
    (newValue: string | null) => {
      if (newValue !== null) {
        setValue(newValue);
        return;
      }

      if (value !== "queue") {
        setValue("queue");
        return;
      }

      setValue("playlists");
    },
    [value]
  );

  const queueLength = getQueueLength();

  return (
    <Accordion
      variant="separated"
      radius="lg"
      value={value}
      onChange={handleChange}
      classNames={classes}
    >
      <Accordion.Item value="queue">
        <Accordion.Control
          icon={<IconPlaylist />}
          data-opened={value == "queue"}
          disabled={!spotifyConnected}
        >
          <Group justify="space-between" pr="md" align="center">
            <Text>Queue {queueLength ? `(${queueLength})` : ""}</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Queue />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="playlists">
        <Accordion.Control
          icon={<IconBrandSpotify />}
          data-opened={value == "playlists"}
          disabled={!spotifyConnected}
        >
          {spotifyConnected
            ? "Add from Spotify"
            : "Connect your spotify account to add songs!"}
        </Accordion.Control>
        <Accordion.Panel>
          {spotifyConnected && (
            <PanelGroup direction="horizontal" autoSaveId="playlists">
              <Panel minSizePercentage={10}>
                <Stack gap="xs">
                  <TextInput
                    placeholder="What do you want to listen to?"
                    variant="filled"
                    defaultValue={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.currentTarget.value)
                    }
                  />
                  <PlaylistSelector
                    playlists={playlists}
                    selected={selectedPlaylist}
                    setSelected={setSelectedPlaylist}
                  />
                </Stack>
              </Panel>
              <PanelResizeHandle className={classes.resizeHandle}>
                <IconMenuOrder className={classes.resizeIcon} />
              </PanelResizeHandle>
              <Panel minSizePercentage={30}>
                <LazyTrackList
                  id={selectedPlaylist}
                  searchQuery={searchQuery}
                />
              </Panel>
            </PanelGroup>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
