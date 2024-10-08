import { LyricsActionsSwitcher } from "@/components/PanelSwitcher/LyricsActionsSwitcher";
import { PlayerPanel } from "@/components/PlayerPanel/PlayerPanel";
import { QueuePanel } from "@/components/QueuePanel/QueuePanel";
import { SearchPanel } from "@/components/SearchPanel/SearchPanel";
import { Socket } from "@/components/Socket";
import { SpotifyPanel } from "@/components/SpotifyPanel/SpotifyPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRequest } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getBotToken, getGuild, isSpotifyEnabled } from "@/utils/actions";
import { Provider as JotaiProvider } from "jotai";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { guildId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.guildId;
  const guild = await getGuild(id);

  return {
    title: `Zeenox | ${guild?.Name ?? "Unknown"}`,
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
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/api/login/discord");
  }
  const [discord] =
    await sql`SELECT * FROM oauth_account WHERE provider_id = 'discord' AND user_id = ${user.id}`;
  const [spotify] =
    await sql`SELECT * FROM oauth_account WHERE provider_id = 'spotify' AND user_id = ${user.id}`;

  const discordId = discord?.provider_user_id;
  const serverSessionToken = await getBotToken(discordId!, params.guildId);
  if (!serverSessionToken) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  const spotifyEnabled = await isSpotifyEnabled();

  return (
    <JotaiProvider>
      <Socket id={params.guildId} botToken={serverSessionToken} />
      <div className="relative grid h-[calc(-30px_+_100vh)] min-h-[750px] min-w-[1000px] gap-4 [grid-template-areas:'tracks_queue_extra''player_player_player'] [grid-template-columns:1fr_1fr_1fr] [grid-template-rows:1fr_auto]">
        {spotify && spotifyEnabled ? (
          <SpotifyPanel />
        ) : (
          <SearchPanel isSpotifyEnabled={spotifyEnabled} />
        )}
        <QueuePanel />
        <LyricsActionsSwitcher />
        <PlayerPanel />
      </div>
    </JotaiProvider>
  );
}
