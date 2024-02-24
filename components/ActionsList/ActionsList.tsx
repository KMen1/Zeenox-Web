"use client";

import { Action } from "@/types/socket";
import { actionsAtom } from "@/utils/atoms";
import { Card, Center, Skeleton, Stack, Text } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { ActionCard } from "../ActionCard/ActionCard";
import { MemoizedList } from "../MemoizedList/MemoizedList";
import { useSize } from "../useSize";
import { getChildren, getImage, getItemSize, getTitle } from "./utils";

export function ActionsList() {
  const actions = useAtomValue(actionsAtom);
  const windowSize = useSize();

  const height = (windowSize[1] - 425) / 2;

  if (actions === null)
    return (
      <Stack gap={10} h={height}>
        <Skeleton w="100%" h={140} />
        <Skeleton w="100%" h={60} />
        <Skeleton w="100%" h={60} />
      </Stack>
    );

  if (actions.length === 0)
    return (
      <Card shadow="md" h={height} maw={350}>
        <Center h="100%">
          <Stack gap={0} align="center">
            <IconMoodSad size={100} />
            <Text fw={700} size="xl">
              Nothing here
            </Text>
            <Text fw={400} size="md" ta="center">
              Start using the player and actions will show up here!
            </Text>
          </Stack>
        </Center>
      </Card>
    );

  return (
    <MemoizedList<Action>
      items={actions}
      height={height}
      width="100%"
      renderItem={(item) => {
        return (
          <ActionCard
            title={getTitle(item)}
            bgImage={getImage(item)}
            user={item.User}
            timestampMs={item.Timestamp}
          >
            {getChildren(item)}
          </ActionCard>
        );
      }}
      itemHeight={(item) => getItemSize(item)}
      variableSize
    />
  );
}
