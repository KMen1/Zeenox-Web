"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { Input } from "@/components/ui/input";
import { IconBrandSpotify, IconMenuOrder } from "@tabler/icons-react";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PlaylistSelector } from "./PlaylistSelector";
import { PlaylistTrackLazyList } from "./PlaylistTrackList";
import { SearchLazyList } from "./SearchTrackList";
import classes from "./SpotifyPanel.module.css";

export function SpotifyPanel() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("saved");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <ContentCard
      title={"Spotify Library"}
      icon={<IconBrandSpotify />}
      className="[grid-area:tracks]"
    >
      <div className="flex h-full flex-col gap-2" id="spotify">
        <Input
          type="text"
          placeholder="What do you want to listen to?"
          className="border-none bg-white/10 text-white/90"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.currentTarget.value !== "") {
              setSearchQuery(event.currentTarget.value);
              setSelectedPlaylist("search");
            }
          }}
        />
        <PanelGroup direction="horizontal" autoSaveId="playlists">
          <Panel minSize={30} defaultSize={30} collapsible collapsedSize={8}>
            <PlaylistSelector
              selected={selectedPlaylist}
              setSelected={setSelectedPlaylist}
            />
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
      </div>
    </ContentCard>
  );
}
