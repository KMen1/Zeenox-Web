"use client";

import { Stack, Text } from "@mantine/core";
import { useCurrentTrack } from "../CurrentTrackProvider";

export default function PlayerWidgetTitleAuthor() {
  const trackData = useCurrentTrack();
  const title = trackData.Title;
  const author = trackData.Author;

  return (
    <Stack gap={1}>
      <Text size="lg" c="white" lh={1.2} fw={600} lineClamp={1}>
        {title}
      </Text>
      <Text size="sm" lh={1} fw={400}>
        {author}
      </Text>
    </Stack>
  );
}
