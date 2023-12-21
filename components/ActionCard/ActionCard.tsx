import { DiscordUserData } from "@/types";
import { Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import TimeAgo from "react-timeago";
import classes from "./ActionCard.module.css";

export function ActionCard({
  title,
  user,
  timestampMs,
  bgImage,
  children,
}: {
  title: string;
  user: DiscordUserData;
  timestampMs: number;
  bgImage?: string;
  children: React.ReactNode;
}) {
  const time = new Date(timestampMs * 1000);

  return (
    <div className={classes.container}>
      <div
        className={classes.bgimage}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={classes.blur} />
      <Card classNames={classes} p="1.25rem" data-hasimage={!!bgImage}>
        <Stack gap="xs">
          <Text fw={700} c="white" size="1.2rem">
            {title}
          </Text>
          {children}
          <Group justify="space-between">
            <Group gap={7}>
              <Image
                src={user.AvatarUrl ?? ""}
                width={20}
                height={20}
                alt={user.DisplayName}
                style={{ borderRadius: "50%" }}
              />
              <Text c="white" size="0.875rem">
                {user.DisplayName}
              </Text>
            </Group>
            <Tooltip label={time.toLocaleTimeString()}>
              <Text c="white" size="0.875rem">
                <TimeAgo date={time} />
              </Text>
            </Tooltip>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
