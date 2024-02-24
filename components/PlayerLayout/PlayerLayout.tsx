import { currentUser } from "@clerk/nextjs";
import { Grid, GridCol, Group, Stack } from "@mantine/core";
import {
  IconBlockquote,
  IconBrandSpotify,
  IconLayoutList,
  IconListSearch,
  IconPlaylist,
} from "@tabler/icons-react";
import { ActionsList } from "../ActionsList/ActionsList";
import { ContentCard } from "../ContentCard/ContentCard";
import { LyricsCard } from "../LyricsCard/LyricsCard";
import { Player2 } from "../Player2/Player2";
import { QueuePanel } from "../QueuePanel/QueuePanel";
import { SearchPanel } from "../SearchPanel/SearchPanel";
import { SpotifyPanel } from "../SpotifyPanel/SpotifyPanel";

export async function PlayerLayout() {
  const user = await currentUser();
  const spotify = user?.externalAccounts.find(
    (a) => a.provider === "oauth_spotify"
  );

  return (
    <Stack justify="space-between" h="100%">
      <Grid style={{ overflow: "visible" }}>
        <GridCol span="auto">
          <Group wrap="nowrap" grow>
            <ContentCard
              title={spotify ? "Add from Spotify" : "Search for a song"}
              icon={spotify ? <IconBrandSpotify /> : <IconListSearch />}
            >
              {spotify ? <SpotifyPanel /> : <SearchPanel />}
            </ContentCard>
            <ContentCard title="Queue" icon={<IconPlaylist />}>
              <QueuePanel />
            </ContentCard>
          </Group>
        </GridCol>
        <GridCol span="content">
          <Stack>
            <ContentCard title="Actions" icon={<IconLayoutList />}>
              <ActionsList />
            </ContentCard>
            <ContentCard title="Lyrics" icon={<IconBlockquote />}>
              <LyricsCard />
            </ContentCard>
          </Stack>
        </GridCol>
      </Grid>
      <Player2 />
    </Stack>
  );
}
