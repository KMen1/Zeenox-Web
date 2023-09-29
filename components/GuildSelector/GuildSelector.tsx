"use client";

import { GuildData } from "@/types";
import { Card, Center, Grid, Space, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export function GuildSelector({ guilds }: { guilds: GuildData[] }) {
  return (
    <Grid>
      {guilds.map((guild) => (
        <Grid.Col key={guild.Id} span={{ xs: 6, md: 3 }}>
          <Link href={`/dashboard/${guild.Id}`}>
            <Card shadow="md" withBorder>
              <Center>
                <Image
                  src={guild.IconUrl}
                  alt={guild.Name}
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%" }}
                />
              </Center>
              <Space h="sm" />
              <Text size="md" ta="center">
                {guild.Name}
              </Text>
            </Card>
          </Link>
        </Grid.Col>
      ))}
    </Grid>
  );
}
