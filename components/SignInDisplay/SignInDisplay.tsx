"use client";

import { ActionIcon } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export function SignInDisplay() {
  return (
    <ActionIcon
      variant="default"
      onClick={() => signIn("discord")}
      title="Login with Discord"
    >
      <IconUser size="1.1rem" />
    </ActionIcon>
  );
}
