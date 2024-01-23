import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridCol,
  Stack,
} from "@mantine/core";
import NextTrack from "../NextTrack/NextTrack";
import { Player } from "../Player/Player";
import { QueuePlaylistAccordion } from "../QueuePlaylistAccordion/QueuePlaylistAccordion";
import { getSpotifyPlaylists } from "@/app/utils";
import { currentUser } from "@clerk/nextjs";
import { ActionsList } from "../ActionsList/ActionsList";
import { LyricsCard } from "../LyricsCard/LyricsCard";
import { IconBlockquote, IconLayoutList } from "@tabler/icons-react";

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
          <Accordion variant="separated" radius="lg">
            <AccordionItem value="actions">
              <AccordionControl icon={<IconLayoutList />}>
                Actions
              </AccordionControl>
              <AccordionPanel>
                <ActionsList />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="lyrics">
              <AccordionControl icon={<IconBlockquote />}>
                Lyrics
              </AccordionControl>
              <AccordionPanel>
                <LyricsCard />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </GridCol>
      </Grid>
    </>
  );
}
