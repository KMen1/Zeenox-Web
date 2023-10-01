"use client";

import {
  Container,
  Card,
  Group,
  Grid,
  Title,
  Stack,
  Avatar,
  Tooltip,
} from "@mantine/core";
import PlayerWidget from "../PlayerWidget";
import { NextTrackWidget } from "../NextTrackWidget/NextTrackWidget";
import QueueWidget from "../QueueWidget";
import { DiscordUserData, GuildData } from "@/types";
import { ListenerDisplay } from "./ListenerDisplay";

export function PlayerLayout({
  guildData,
  listeners,
}: {
  guildData: GuildData;
  listeners: DiscordUserData[];
}) {
  return (
    <Container p="md" size="xl">
      <Card mb="md" withBorder shadow="md">
        <Group justify="space-between">
          <Group align="center" gap={10}>
            <Avatar
              src={guildData!.IconUrl}
              alt={guildData!.Name}
              radius="xl"
              size="sm"
            />
            <Title order={4}>{guildData!.Name}</Title>
          </Group>
          <ListenerDisplay />
        </Group>
      </Card>
      <Grid grow>
        <Grid.Col span={1}>
          <Stack>
            <PlayerWidget />
            <NextTrackWidget />
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <QueueWidget />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
