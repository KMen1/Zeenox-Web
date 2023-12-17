import {
  Title,
  Card,
  Group,
  UnstyledButton,
  Text,
  Avatar,
} from "@mantine/core";
import Link from "next/link";
import classes from "./Navbar.module.css";
import { IconHome } from "@tabler/icons-react";
import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";
import { getDiscordGuilds } from "@/app/utils";
import { NavbarGuildPicker } from "../NavbarGuildPicker/NavbarGuildPicker";
import { ColorSchemeToggler } from "../ColorSchemeToggler/ColorSchemeToggler";

export async function Navbar() {
  const user = await currentUser();
  const guilds = user ? await getDiscordGuilds(user.id) : null;

  return (
    <Card py="xs" pl="lg" className={classes.header} shadow="sm">
      <Group justify="space-between">
        <Group gap={0}>
          <Title size="lg" pr="sm">
            Zeenox
          </Title>
          <UnstyledButton component={Link} href="/" className={classes.link}>
            <Group gap={7}>
              <Avatar alt="Home" radius="xl" size={20}>
                <IconHome size=".8rem" />
              </Avatar>
              <Text fw={500} size="sm" lh={1} mr={3}>
                Home
              </Text>
            </Group>
          </UnstyledButton>
          <SignedIn>
            <NavbarGuildPicker guilds={guilds} />
          </SignedIn>
        </Group>
        <Group gap="xs">
          <ColorSchemeToggler />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Group>
      </Group>
    </Card>
  );
}
