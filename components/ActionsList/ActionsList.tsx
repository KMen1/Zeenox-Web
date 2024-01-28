"use client";

import {
  Card,
  Center,
  Stack,
  Text,
  Divider,
  Skeleton,
  Group,
} from "@mantine/core";
import { IconList, IconMoodSad } from "@tabler/icons-react";
import { ActionCard } from "../ActionCard/ActionCard";
import { useAtomValue } from "jotai";
import { actionsAtom } from "@/utils/atoms";
import { getChildren, getImage, getTitle, getItemSize } from "./utils";
import { MemoizedList } from "../MemoizedList/MemoizedList";
import { Action } from "@/types/socket";

export function ActionsList() {
  const actions = useAtomValue(actionsAtom);

  if (actions === null)
    return (
      <Card shadow="xl" style={{ height: "100%" }} pt="sm">
        <Group gap={10} align="center">
          <IconList />
          <Text fw={600}>Actions</Text>
        </Group>
        <Divider mt="sm" />
        <Stack gap={10} mt={10}>
          <Skeleton w="100%" h={140} />
          <Skeleton w="100%" h={60} />
          <Skeleton w="100%" h={140} />
          <Skeleton w="100%" h={60} />
        </Stack>
      </Card>
    );

  if (actions.length === 0)
    return (
      <Card shadow="md" style={{ height: "100%" }}>
        <Center h="100%">
          <Stack gap={0} align="center">
            <IconMoodSad size={100} />
            <Text fw={700} size="xl">
              No actions yet
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
      height={435}
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
