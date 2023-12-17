import { getDiscordGuilds, getSocketSessionToken } from "@/app/utils";
import { PlayerLayout } from "@/components/PlayerLayout/PlayerLayout";
import { ActionProvider } from "@/components/Providers/ActionProvider";
import { SocketProvider } from "@/components/Providers/SocketProvider/SocketProvider";
import { currentUser } from "@clerk/nextjs";
import { Skeleton } from "@mantine/core";
import { Metadata } from "next";

type Props = {
  params: { guildId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.guildId;

  const guilds = await getDiscordGuilds((await currentUser())!.id);

  if (!guilds) {
    throw new Error("No guilds");
  }

  const guild = guilds.find((g) => g.id === id);

  if (!guild) {
    throw new Error("Guild not found");
  }

  return {
    title: `Listening in ${guild.name}`,
    icons: {
      icon: [
        {
          url:
            "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon,
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
  const serverSessionToken = await getSocketSessionToken(
    discordId!,
    params.guildId
  );

  if (!serverSessionToken) {
    return <Skeleton w="100%" h={500} />;
  }

  return (
    <ActionProvider socketSessionToken={serverSessionToken}>
      <SocketProvider
        id={params.guildId}
        socketSessionToken={serverSessionToken}
      >
        <PlayerLayout />
      </SocketProvider>
    </ActionProvider>
  );
}
