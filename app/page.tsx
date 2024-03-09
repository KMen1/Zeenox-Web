import { GuildPicker } from "@/features/guild-picker";
import { getAvailableGuilds } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs";
import { Card, Group, SimpleGrid, Stack, Title } from "@mantine/core";
import { IconServer } from "@tabler/icons-react";

export default async function Home() {
  const user = await currentUser();
  const discordId = user?.externalAccounts.find(
    (a) => a.provider === "oauth_discord"
  )?.externalId;
  const guilds = user ? await getAvailableGuilds(discordId!) : null;

  return (
    <Card>
      <Stack>
        <Group>
          <IconServer size={36} />
          <Title order={2}>Please Select a Server</Title>
        </Group>
        <SimpleGrid cols={5}>
          <GuildPicker guilds={guilds ?? []} />
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
