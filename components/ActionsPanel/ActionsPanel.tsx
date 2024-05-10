"use client";

import { ContentCard } from "@/components/ContentCard/ContentCard";
import { Center } from "@/components/ui/center";
import { Skeleton } from "@/components/ui/skeleton";
import { actionsAtom } from "@/stores/atoms";
import { IconLayoutList, IconMoodSad } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { Virtuoso } from "react-virtuoso";
import { ActionCard } from "./ActionCard";

export function ActionsPanel() {
  const actions = useAtomValue(actionsAtom);

  if (actions === null)
    return (
      <ContentCard title="Actions" icon={<IconLayoutList />}>
        <div className="flex flex-col gap-2" style={{ height: "100%" }}>
          <Skeleton className="h-[140px] w-full" />
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
        </div>
      </ContentCard>
    );

  if (actions.length === 0)
    return (
      <ContentCard title="Actions" icon={<IconLayoutList />}>
        <Center>
          <div className="flex flex-col items-center">
            <IconMoodSad size={100} />
            <p className="text-2xl font-bold">Nothing here</p>
            <p className="text-sm">
              Start using the player and actions will show up here!
            </p>
          </div>
        </Center>
      </ContentCard>
    );

  return (
    <ContentCard
      title="Actions"
      icon={<IconLayoutList />}
      className="[grid-area:extra]"
    >
      <Virtuoso
        style={{ height: "100%" }}
        data={actions}
        itemContent={(_, item) => {
          return (
            <div className="mb-4">
              <ActionCard action={item} />
            </div>
          );
        }}
      />
    </ContentCard>
  );
}
