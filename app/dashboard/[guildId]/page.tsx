import { LyricsActionsSwitcher } from "@/components/PanelSwitcher/LyricsActionsSwitcher";
import { PlayerBar } from "@/features/player-panel/";
import { QueuePanel } from "@/features/queue-panel";
import { SearchPanel } from "@/features/search-panel";
import { Socket } from "@/features/socket";
import { SpotifyPanel } from "@/features/spotify-panel";
import { getBotToken, getGuild } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs";
import { Grid, GridCol, Skeleton, Stack } from "@mantine/core";
import { Provider as JotaiProvider } from "jotai";
import { Metadata } from "next";

type Props = {
  params: { guildId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.guildId;
  const guild = await getGuild(id);

  return {
    title: `Listening in ${guild?.Name ?? "Unknown"}`,
    icons: {
      icon: [
        {
          url: guild?.IconUrl ?? "/favicon.ico",
        },
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { guildId: string };
}) {
  const user = await currentUser();
  const discordId = user?.externalAccounts.find(
    (a) => a.provider === "oauth_discord"
  )?.externalId;
  const serverSessionToken = await getBotToken(discordId!, params.guildId);
  const spotify = user?.externalAccounts.find(
    (a) => a.provider === "oauth_spotify"
  );

  if (!serverSessionToken) {
    return <Skeleton w="100%" h={500} />;
  }

  return (
    <JotaiProvider>
      <Socket id={params.guildId} botToken={serverSessionToken} />
      <Stack justify="space-between" h="100%">
        <Grid style={{ overflow: "visible" }}>
          <GridCol span={8}>
            <Grid>
              <GridCol span={6}>
                {spotify ? <SpotifyPanel /> : <SearchPanel />}
              </GridCol>

              <GridCol span="auto">
                <QueuePanel />
              </GridCol>
            </Grid>
          </GridCol>
          <GridCol span="auto">
            <LyricsActionsSwitcher />
          </GridCol>
        </Grid>
        <PlayerBar />
      </Stack>
    </JotaiProvider>
  );
}
