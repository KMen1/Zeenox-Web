"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggler() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <ActionIcon
      variant="default"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="sm"
    >
      {dark ? <IconSun size="0.8rem" /> : <IconMoonStars size="0.8rem" />}
    </ActionIcon>
  );
}
