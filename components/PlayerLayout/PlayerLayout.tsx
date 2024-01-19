import { Card, Grid, GridCol, Stack } from "@mantine/core";
import NextTrack from "../NextTrack/NextTrack";
import { Player } from "../Player/Player";
import { QueuePlaylistAccordion } from "../QueuePlaylistAccordion/QueuePlaylistAccordion";
import { getSpotifyPlaylists } from "@/app/utils";
import { currentUser } from "@clerk/nextjs";
import { ActionsList } from "../ActionsList/ActionsList";

export async function PlayerLayout() {
  const user = await currentUser();
  const spotify = user?.externalAccounts.find(
    (a) => a.provider === "oauth_spotify"
  );

  const playlists = await getSpotifyPlaylists(user!.id);

  return (
    <>
      <Grid grow style={{ overflow: "visible" }}>
        <GridCol span={{ base: 12, sm: 1 }}>
          <Stack>
            <Player />
            <NextTrack />
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, sm: 6 }}>
          <QueuePlaylistAccordion
            playlists={playlists}
            spotifyConnected={spotify != undefined}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 2 }}>
          <ActionsList />
        </GridCol>
      </Grid>
    </>
  );
}
