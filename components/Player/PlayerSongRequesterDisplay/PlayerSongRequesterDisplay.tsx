"use client";

import { currentTrackAtom } from "@/utils/atoms";
import { Avatar, Flex, Group, Skeleton, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import classes from "./PlayerSongRequesterDisplay.module.css";

export function PlayerSongRequesterDisplay() {
  const track = useAtomValue(currentTrackAtom);
  if (!track) return <Skeleton w={100} h={10} />;

  const requestedBy = track.RequestedBy;

  return (
    <Flex align="center" gap={5}>
      <Avatar
        src={requestedBy?.AvatarUrl}
        alt={requestedBy?.Username}
        radius="xl"
        size="xs"
      />
      <Group gap={2}>
        {requestedBy?.Username ? (
          <>
            <Text size="10" lh={1} fw={400} className={classes.main}>
              Added By
            </Text>
            <Text size="10" lh={1} fw={500} className={classes.main}>
              {requestedBy.DisplayName}
            </Text>
            <Text size="10" className={classes.sub} lh={1} fw={400}>
              ({requestedBy.Username})
            </Text>
          </>
        ) : (
          <Text size="10" lh={1} fw={400} className={classes.main}>
            No information available
          </Text>
        )}
      </Group>
    </Flex>
  );
}
