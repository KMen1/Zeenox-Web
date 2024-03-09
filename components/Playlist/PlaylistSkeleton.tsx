import { Group, Skeleton, Stack } from "@mantine/core";
import classes from "./PlaylistSkeleton.module.css";

export function PlaylistSkeleton() {
  return (
    <Group gap="xs" className={classes.playlist} w="100%">
      <Skeleton h={40} w={40} radius="md" />
      <Stack gap="xs">
        <Skeleton h={12} w={100} />
        <Skeleton h={12} w={60} />
      </Stack>
    </Group>
  );
}
