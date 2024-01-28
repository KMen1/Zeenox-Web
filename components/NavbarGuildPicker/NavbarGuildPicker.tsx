"use client";

import { useEffect, useState } from "react";
import {
  UnstyledButton,
  Menu,
  Group,
  Avatar,
  Text,
  rem,
  Skeleton,
} from "@mantine/core";
import { IconChevronDown, IconShield, IconX } from "@tabler/icons-react";
import classes from "./NavbarGuildPicker.module.css";
import cx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PartialGuild } from "@/types/discord";

export function NavbarGuildPicker({
  guilds,
}: {
  guilds: PartialGuild[] | null;
}) {
  const pathname = usePathname();
  const [selected, setSelected] = useState<PartialGuild | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const guild = guilds?.find((g) => g.id === pathname.split("/")[2]);
    if (guild) setSelected(guild);
    else setSelected(null);
  }, [guilds, pathname]);

  const items = guilds?.map((item) => (
    <Menu.Item
      href={`/dashboard/${item.id}`}
      component={Link}
      leftSection={
        <Avatar
          src={
            item.icon &&
            "https://cdn.discordapp.com/icons/" + item.id + "/" + item.icon
          }
          size={18}
          alt={item.name}
          style={{ borderRadius: "50%" }}
        />
      }
      onClick={() => setSelected(item)}
      key={item.id}
    >
      {item.name}
    </Menu.Item>
  ));

  if (guilds === null) return <Skeleton w={150} h={35} />;
  if (guilds.length === 0)
    return (
      <UnstyledButton
        disabled
        className={cx(classes.guild, { [classes.userActive]: isOpened })}
      >
        <Group gap={7}>
          <Avatar alt="No Guilds Available" radius="xl" size={20} color="red">
            <IconX />
          </Avatar>
          <Text fw={500} size="sm" lh={1} mr={3}>
            No Guilds Available
          </Text>
        </Group>
      </UnstyledButton>
    );

  return (
    <Menu
      onOpen={() => setIsOpened(true)}
      onClose={() => setIsOpened(false)}
      width={200}
      shadow="md"
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.guild, { [classes.guildActive]: isOpened })}
        >
          <Group gap={7}>
            <Avatar
              src={
                selected?.icon &&
                "https://cdn.discordapp.com/icons/" +
                  selected?.id +
                  "/" +
                  selected?.icon
              }
              alt={selected?.name}
              radius="xl"
              size={20}
            >
              <IconShield size=".8rem" />
            </Avatar>
            <Text fw={500} size="sm" lh={1} mr={3}>
              {selected?.name ?? "Select a server"}
            </Text>
            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
