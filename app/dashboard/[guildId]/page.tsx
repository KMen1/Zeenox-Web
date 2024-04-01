import { LyricsActionsSwitcher } from "@/components/PanelSwitcher/LyricsActionsSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerPanel } from "@/features/player-panel/";
import { QueuePanel } from "@/features/queue-panel";
import { SearchPanel } from "@/features/search-panel";
import { Socket } from "@/features/socket";
import { SpotifyPanel } from "@/features/spotify-panel";
import { db, validateRequest } from "@/lib/auth";
import { getBotToken, getGuild } from "@/utils/actions";
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
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/api/login/discord");
  }
  const [discord] =
    await db`SELECT * FROM oauth_account WHERE provider_id = 'discord' AND user_id = ${user.id}`;
  const [spotify] =
    await db`SELECT * FROM oauth_account WHERE provider_id = 'spotify' AND user_id = ${user.id}`;

  const discordId = discord?.provider_user_id;
  const serverSessionToken = await getBotToken(discordId!, params.guildId);
  if (!serverSessionToken) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  return (
    <JotaiProvider>
      <Socket id={params.guildId} botToken={serverSessionToken} />
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="grid grid-cols-3 gap-4">
          {spotify ? <SpotifyPanel /> : <SearchPanel />}
          <QueuePanel />
          <LyricsActionsSwitcher />
        </div>
        <PlayerPanel />
      </div>
    </JotaiProvider>
  );
}
