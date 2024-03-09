"use client";

import { SocketGuild } from "@/types/socket";
import { getAvgColor } from "@/utils/colorHelpers";
import {
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  lighten,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { FastAverageColorRgba } from "fast-average-color";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Track } from "../../../../components/Track/Track";

type GuildCardProps = {
  guild: SocketGuild;
};

export function GuildCard({ guild }: GuildCardProps) {
  const iconUrl = guild.IconUrl || "/placeholder-guild.jpg";

  const [avgColor, setAvgColor] = useState<FastAverageColorRgba>();
  useEffect(() => {
    const color = getAvgColor(document, `.guildcard-${guild.Id}`);
    setAvgColor(color?.value);
  }, [guild.Id]);

  function getColor(opacity: number) {
    return `rgba(${avgColor?.[0]}, ${avgColor?.[1]}, ${avgColor?.[2]}, ${opacity})`;
  }

  const isConnected = guild.ConnectedVoiceChannel !== null;
  const isPlaying = guild.CurrentTrack !== null;

  return (
    <Card
      key={guild.Id}
      className={`guildcard-${guild.Id}`}
      style={{
        background: getColor(0.2),
      }}
    >
      <Stack gap={5}>
        <Group gap="xs" wrap="nowrap">
          <Image
            src={iconUrl}
            alt={guild.Name}
            crossOrigin="anonymous"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <Text size="md" lineClamp={1} lh={1.4} title={guild.Name}>
            {guild.Name}
          </Text>
        </Group>
        <Divider
          labelPosition="center"
          label={isPlaying ? "Now Playing" : "Not Playing"}
          color={lighten(getColor(1), 0.4)}
        />
        {isPlaying && <Track small track={guild.CurrentTrack!} mode="none" />}
        {!isPlaying && (
          <Stack gap={5} px="xs">
            <Group gap={10}>
              <IconDeviceFloppy color={lighten(getColor(1), 0.4)} />
              <Text size="sm" c={lighten(getColor(1), 0.8)}>
                {guild.ResumeSession
                  ? "Previous session can be resumed!"
                  : "No resume session available!"}
              </Text>
            </Group>
            <Group gap={10}>
              <IconAlertTriangle color={lighten(getColor(1), 0.4)} />
              <Text size="sm" c={lighten(getColor(1), 0.8)}>
                Join a channel before starting!
              </Text>
            </Group>
          </Stack>
        )}
        <Button
          variant="light"
          color={lighten(getColor(1), 0.4)}
          component={Link}
          href={`/dashboard/${guild.Id}`}
          rightSection={<IconArrowRight size={14} />}
        >
          {isPlaying || isConnected ? "Connect" : "Start new session"}
        </Button>
      </Stack>
    </Card>
  );
}
