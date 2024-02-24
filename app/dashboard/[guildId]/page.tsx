import { getBotToken, getDiscordGuilds } from "@/app/actions";
import { PlayerLayout } from "@/components/PlayerLayout/PlayerLayout";
import { Socket } from "@/components/Socket";
import { currentUser } from "@clerk/nextjs";
import { Skeleton } from "@mantine/core";
import { Provider as JotaiProvider } from "jotai";
import { Metadata } from "next";

type Props = {
  params: { guildId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.guildId;

  const guilds = await getDiscordGuilds((await currentUser())!.id);

  const guild = guilds?.find((g) => g.id === id);

  return {
    title: `Listening in ${guild?.name ?? "Unknown"}`,
    icons: {
      icon: [
        {
          url:
            "https://cdn.discordapp.com/icons/" + guild?.id + "/" + guild?.icon,
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

  if (!serverSessionToken) {
    return <Skeleton w="100%" h={500} />;
  }

  return (
    <JotaiProvider>
      <Socket id={params.guildId} botToken={serverSessionToken} />
      <PlayerLayout />
    </JotaiProvider>
  );
}
