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
          <Tooltip.Group openDelay={100} closeDelay={100}>
            <Avatar.Group spacing="sm">
              {listeners.slice(0, 5).map((listener) => (
                <Tooltip
                  key={listener.Username}
                  label={`${listener.DisplayName} (${listener.Username})`}
                  withArrow
                >
                  <Avatar src={listener.AvatarUrl} radius="xl" size="sm" />
                </Tooltip>
              ))}
              {listeners.length > 5 && (
                <Tooltip
                  withArrow
                  label={
                    <>
                      {listeners.slice(5).map((listener) => (
                        <div key={listener.Username}>
                          {listener.DisplayName} ({listener.Username})
                        </div>
                      ))}
                    </>
                  }
                >
                  <Avatar radius="xl" size="sm">
                    +{listeners.length - 5}
                  </Avatar>
                </Tooltip>
              )}
            </Avatar.Group>
          </Tooltip.Group>
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
