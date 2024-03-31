import { LyricsActionsSwitcher } from "@/components/PanelSwitcher/LyricsActionsSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerPanel } from "@/features/player-panel/";
import { QueuePanel } from "@/features/queue-panel";
import { SearchPanel } from "@/features/search-panel";
import { Socket } from "@/features/socket";
import { SpotifyPanel } from "@/features/spotify-panel";
import { getBotToken, getGuild } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs";
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
    (a) => a.provider === "oauth_discord",
  )?.externalId;
  const serverSessionToken = await getBotToken(discordId!, params.guildId);
  const spotify = user?.externalAccounts.find(
    (a) => a.provider === "oauth_spotify",
  );

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
