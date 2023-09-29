import { PlayerLayout } from "@/components/PlayerLayout/PlayerLayout";
import { SocketProvider } from "@/components/SocketProvider";
import { GuildData, ServerMessage } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Select a server",
  description: "Welcome to Zeenox",
};

export default async function Page({
  params,
}: {
  params: { guildId: string };
}) {
  const cookieStore = cookies();
  const serverSessionToken = cookieStore.get("serverSessionToken")?.value!;
  const playerData = await getPlayerData(serverSessionToken, params.guildId);
  const guildData = await getGuildData(serverSessionToken, params.guildId)!;

  return (
    <SocketProvider
      id={params.guildId}
      initialData={playerData!}
      serverSessionToken={serverSessionToken}
    >
      <PlayerLayout
        guildData={guildData!}
        listeners={playerData?.Player.Listeners!}
      />
    </SocketProvider>
  );
}

async function getPlayerData(token: string, guildId: string) {
  try {
    const playerRes = await fetch(
      `${process.env.BOT_URL}/api/v1/player/getplayer?id=${guildId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
      }
    );
    return (await playerRes.json()) as ServerMessage;
  } catch (e) {
    console.log(e);
  }
}

async function getGuildData(token: string, guildId: string) {
  try {
    const guildRes = await fetch(
      `${process.env.BOT_URL}/api/v1/guild/getguild?id=${guildId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return (await guildRes.json()) as GuildData;
  } catch (e) {
    console.log(e);
  }
}
