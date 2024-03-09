import { Group, Skeleton, Stack } from "@mantine/core";
import classes from "./TrackSkeleton.module.css";

export function TrackSkeleton() {
  return (
    <Group className={classes.track} w="100%" justify="space-between">
      <Group>
        <Skeleton h={36} w={36} radius="md" />
        <Stack gap="xs">
          <Skeleton h={12} w={100} />
          <Skeleton h={12} w={60} />
        </Stack>
      </Group>

      <Skeleton h={12} w={40} />
    </Group>
  );
}
