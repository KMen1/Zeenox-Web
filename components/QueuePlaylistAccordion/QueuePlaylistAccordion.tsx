"use client";

import { Playlist } from "@/types/spotify";
import { Accordion, Group, Text } from "@mantine/core";
import { IconBrandSpotify, IconPlaylist } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { QueuePanel } from "../QueuePanel/QueuePanel";
import { SpotifyPanel } from "../SpotifyPanel/SpotifyPanel";
import classes from "./QueuePlaylistAccordion.module.css";

export function QueuePlaylistAccordion({
  spotifyConnected,
}: {
  playlists: Playlist[] | null;
  spotifyConnected: boolean;
}) {
  const [value, setValue] = useState("queue");

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
            <Text>Queue</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <QueuePanel />
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
          {spotifyConnected && <SpotifyPanel />}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
