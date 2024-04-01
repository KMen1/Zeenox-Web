"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export function NavbarBackButton() {
  const pathname = usePathname();

  return pathname.startsWith("/dashboard") ? (
    <Button className="rounded-2xl" variant="link" size="sm" asChild>
      <Link href="/">Back</Link>
    </Button>
  ) : null;
}
