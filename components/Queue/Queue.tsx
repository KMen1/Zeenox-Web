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
import { useEffect, useState } from "react";
import { DndTrackList } from "../DndTrackList/DndTrackList";
import {
  IconArrowsShuffle,
  IconCopyOff,
  IconExclamationMark,
  IconMoodSad,
  IconRotateClockwise,
  IconTrash,
} from "@tabler/icons-react";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { useAtomValue } from "jotai";
import { actionFetchAtom, queueAtom } from "@/utils/atoms";
import { getErrorMessageFromCode } from "@/utils/utils";

export function Queue() {
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  const tracks = useAtomValue(queueAtom);
  const { moveTrack, shuffleQueue, clearQueue, distinctQueue, reverseQueue } =
    useAtomValue(actionFetchAtom);

  function shuffle() {
    const id = `shuffle-queue-${Date.now()}`;
    showNotification(id, "Shuffling queue", null, true);
    shuffleQueue().then((res) => {
      if (res.success) {
        updateNotification(
          id,
          "Shuffled the queue",
          <IconTrash />,
          "green",
          "Successfully shuffled the queue!"
        );
      } else {
        updateNotification(
          id,
          "Unable to shuffle the queue",
          <IconExclamationMark />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function clear() {
    const id = `clear-queue-${Date.now()}`;
    showNotification(id, "Clearing queue", null, true);
    clearQueue().then((res) => {
      if (res.success) {
        updateNotification(
          id,
          "Cleared the queue",
          <IconTrash />,
          "green",
          "Successfully cleared the queue!"
        );
      } else {
        updateNotification(
          id,
          "Unable to clear the queue",
          <IconExclamationMark />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function distinct() {
    const id = `distinct-queue-${Date.now()}`;
    showNotification(id, "Removing duplicate tracks", null, true);
    distinctQueue().then((res) => {
      if (res.success) {
        updateNotification(
          id,
          "Removed duplicate tracks",
          <IconCopyOff />,
          "green",
          "Successfully removed duplicate tracks!"
        );
      } else {
        updateNotification(
          id,
          "Unable to remove duplicate tracks",
          <IconExclamationMark />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

  function reverse() {
    const id = `reverse-queue-${Date.now()}`;
    showNotification(id, "Reversing queue", null, true);
    reverseQueue().then((res) => {
      if (res.success) {
        updateNotification(
          id,
          "Reversed the queue",
          <IconRotateClockwise />,
          "green",
          "Successfully reversed the queue!"
        );
      } else {
        updateNotification(
          id,
          "Unable to reverse the queue",
          <IconExclamationMark />,
          "red",
          getErrorMessageFromCode(res.code!)
        );
      }
    });
  }

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
    <>
      {winReady && (
        <div className="relative">
          <Group align="center" gap={0} className="absolute right-6 -top-12">
            <Tooltip label="Shuffle">
              <ActionIcon
                variant="transparent"
                color="blue"
                aria-label="Shuffle"
                onClick={(e) => {
                  e.stopPropagation();
                  shuffle();
                }}
              >
                <IconArrowsShuffle size="1.3rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reverse">
              <ActionIcon
                variant="transparent"
                color="blue"
                aria-label="Reverse"
                onClick={(e) => {
                  e.stopPropagation();
                  reverse();
                }}
              >
                <IconRotateClockwise size="1.3rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Remove duplicate tracks">
              <ActionIcon
                variant="transparent"
                color="yellow"
                aria-label="Remove duplicate tracks"
                onClick={(e) => {
                  e.stopPropagation();
                  distinct();
                }}
              >
                <IconCopyOff size="1.3rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Clear">
              <ActionIcon
                variant="transparent"
                color="red"
                aria-label="Clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
              >
                <IconTrash size="1.3rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
          <DndTrackList baseTracks={tracks} onMove={moveTrack} />
        </div>
      )}
    </>
  );
}
