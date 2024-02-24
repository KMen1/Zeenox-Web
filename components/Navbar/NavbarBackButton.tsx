"use client";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavbarBackButton() {
  const pathname = usePathname();

  return pathname.startsWith("/dashboard") ? (
    <Button
      component={Link}
      href="/"
      variant="light"
      color="red"
      size="xs"
      leftSection={<IconArrowLeft size=".8rem" />}
    >
      Back
    </Button>
  ) : null;
}
