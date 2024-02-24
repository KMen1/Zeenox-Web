import { SocketUser } from "@/types/socket";
import { Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import TimeAgo from "react-timeago";
import classes from "./ActionCard.module.css";

type ActionCardProps = {
  title: string;
  user: SocketUser;
  timestampMs: number;
  bgImage?: string;
  children: React.ReactNode;
};

export function ActionCard({
  title,
  user,
  timestampMs,
  bgImage,
  children,
}: ActionCardProps) {
  const time = new Date(timestampMs * 1000);

  return (
    <div className={classes.container}>
      <div
        className={classes.bgimage}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={classes.blur} />
      <Card
        classNames={classes}
        p="1.25rem"
        data-hasimage={!!bgImage}
        withBorder
      >
        <Stack gap="xs">
          <Text fw={700} c="dark.0" size="1.2rem">
            {title}
          </Text>
          {children}
          <Group justify="space-between">
            <Group gap={7}>
              <Image
                src={user.AvatarUrl ?? ""}
                width={15}
                height={15}
                alt={user.DisplayName}
                style={{ borderRadius: "50%" }}
              />
              <Text size="0.665rem" className={classes.footerText}>
                {user.DisplayName}
              </Text>
            </Group>
            <Tooltip label={time.toLocaleTimeString()}>
              <Text size="0.665rem" className={classes.footerText}>
                <TimeAgo
                  date={time}
                  formatter={(value, unit) => {
                    if (unit === "second" && value < 5) {
                      return "just now";
                    }
                    return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
                  }}
                />
              </Text>
            </Tooltip>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
