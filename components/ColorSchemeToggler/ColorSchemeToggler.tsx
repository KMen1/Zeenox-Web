"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggler() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon
      variant="light"
      onClick={toggleColorScheme}
      color={colorScheme === "dark" ? "yellow" : "blue"}
    >
      {colorScheme === "dark" ? (
        <IconSun size="1.1rem" />
      ) : (
        <IconMoon size="1.1rem" />
      )}
    </ActionIcon>
  );
}
