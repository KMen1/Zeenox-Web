"use client";

import { Avatar, Group, Text } from "@mantine/core";
import { ColorSchemeToggler } from "../ColorSchemeToggler/ColorSchemeToggler";
import { type Session } from "next-auth";

export function UserDisplay({ user }: { user: Session["user"] }) {
  return (
    <Group gap="xs">
      <Avatar
        src={user.image}
        alt={user.name!}
        radius="xl"
        color="blue"
        size="sm"
      />
      <Text size="xs">Logged in as {user.name}</Text>
      <ColorSchemeToggler />
    </Group>
  );
}
