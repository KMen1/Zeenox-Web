import { GuildSelector } from "@/components/GuildSelector/GuildSelector";
import { GuildData } from "@/types";
import { Title } from "@mantine/core";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@mantine/core";

export const metadata: Metadata = {
  title: "Select a server | Zeenox",
  description: "Select a server to manage",
};

export default async function Page() {
  const guilds = await getGuilds();

  return (
    <Container p="md" size="xl">
      <Title order={1}>Available Servers</Title>
      <GuildSelector guilds={guilds} />
    </Container>
  );
}

async function getGuilds() {
  const cookieStore = cookies();
  const serverSessionToken = cookieStore.get("serverSessionToken")?.value;
  if (!serverSessionToken) throw new Error("No server session token found");

  const guildsRes = await fetch(
    `${process.env.BOT_URL}/api/v1/Guild/GetAvailableGuilds`,
    {
      headers: {
        Authorization: `Bearer ${serverSessionToken}`,
      },
    }
  );
  return (await guildsRes.json()) as GuildData[];
}
