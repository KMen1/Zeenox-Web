"use client";

import { SocketGuild } from "@/types/socket";
import { getGuild } from "@/utils/actions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavbarStatus() {
  const pathName = usePathname();
  const id = pathName.split("/")[2];
  const [guild, setGuild] = useState<SocketGuild | null>(null);

  useEffect(() => {
    if (id) {
      getGuild(id).then((data) => {
        setGuild(data);
      });
    }
  }, [id]);

  return (
    <h1 className="pr-2 text-xl font-semibold">
      {guild ? `Listening in ${guild.Name}` : "Zeenox"}
    </h1>
  );
}
