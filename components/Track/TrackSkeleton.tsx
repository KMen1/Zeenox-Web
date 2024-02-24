import { Group, Skeleton, Stack } from "@mantine/core";

export function TrackSkeleton() {
  return (
    <Group p="xs" w="100%" justify="space-between">
      <Group>
        <Skeleton h={8} w={8} />
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
