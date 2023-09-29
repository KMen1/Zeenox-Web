import { GuildSelector } from "@/components/GuildSelector/GuildSelector";
import { GuildData } from "@/types";
import { Container, Title } from "@mantine/core";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Select a server",
  description: "Welcome to Zeenox",
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
