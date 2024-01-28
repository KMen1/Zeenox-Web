"use client";

import {
  ActionIcon,
  Center,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { DndTrackList } from "../DndTrackList/DndTrackList";
import {
  IconArrowsShuffle,
  IconCopyOff,
  IconMoodSad,
  IconRotateClockwise,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { queueAtom } from "@/utils/atoms";
import {
  useClear,
  useDistinct,
  useMove,
  useReverse,
  useShuffle,
} from "../hooks";

export function Queue() {
  const tracks = useAtomValue(queueAtom);
  const move = useMove();
  const shuffle = useShuffle();
  const clear = useClear();
  const distinct = useDistinct();
  const reverse = useReverse();

  if (tracks === null) {
    return (
      <Stack gap={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Group key={i} justify="space-between">
            <Flex align="center" gap={10} mt={10}>
              <Skeleton w={34} h={34} radius="md" />
              <Stack gap={10} w="70%">
                <Skeleton w={150} h={7} />
                <Skeleton w={100} h={7} />
              </Stack>
            </Flex>
            <Group gap={10}>
              <Skeleton circle w={10} h={10} />
              <Skeleton circle w={10} h={10} />
              <Skeleton circle h={10} w={10} />
            </Group>
          </Group>
        ))}
      </Stack>
    );
  }

  if (tracks.length === 0)
    return (
      <Center h={425} p="xl">
        <Stack gap={0} align="center">
          <IconMoodSad size={100} />
          <Text fw={700} size="xl">
            Nothing here
          </Text>
          <Text fw={400} size="md" ta="center">
            Start adding songs and they will show up here!
          </Text>
        </Stack>
      </Center>
    );

  return (
    <div className="relative">
      <Group align="center" gap="xs" className="absolute right-6 -top-11">
        <Tooltip label="Shuffle">
          <ActionIcon
            variant="light"
            color="blue"
            aria-label="Shuffle"
            onClick={(e) => {
              e.stopPropagation();
              shuffle();
            }}
          >
            <IconArrowsShuffle size="1.1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Reverse">
          <ActionIcon
            variant="light"
            color="blue"
            aria-label="Reverse"
            onClick={(e) => {
              e.stopPropagation();
              reverse();
            }}
          >
            <IconRotateClockwise size="1.1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Remove duplicates">
          <ActionIcon
            variant="light"
            color="yellow"
            aria-label="Remove duplicates"
            onClick={(e) => {
              e.stopPropagation();
              distinct();
            }}
          >
            <IconCopyOff size="1.1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Clear">
          <ActionIcon
            variant="light"
            color="red"
            aria-label="Clear"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
          >
            <IconTrash size="1.1rem" />
          </ActionIcon>
        </Tooltip>
      </Group>
      <DndTrackList baseTracks={tracks} onMove={(from, to) => move(from, to)} />
    </div>
  );
}
