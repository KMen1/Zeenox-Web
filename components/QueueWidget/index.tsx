"use client";

import {
  Card,
  Divider,
  Flex,
  ScrollArea,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useQueueData } from "../QueueProvider";
import { DragAndDropTrackList } from "./DragAndDropTrackList";
import { useEffect, useState } from "react";
// 19 hours, 59 minutes, 59 seconds
function toHumanTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours > 0 ? `${hours} hours ` : ""}${
    minutes > 0 ? `${minutes} minutes` : ""
  }`;
}

export default function QueueWidget() {
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  const data = useQueueData();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <>
      <Card shadow="md" withBorder style={{ height: "100%" }}>
        <Flex align="center" justify="space-between" gap={16}>
          <Title c={dark ? "" : "black"} order={5}>
            Queue
          </Title>
          <Flex gap={2}>
            {data.Tracks.length === 0 && (
              <Text size="xs" c={dark ? "white" : "black"}>
                Empty
              </Text>
            )}
            {data.Tracks.length > 0 && (
              <>
                <Text size="xs" c={dark ? "" : "black"}>
                  {data.Tracks.length} songs,
                </Text>
                <Text size="xs" c={dark ? "" : "dimmed"}>
                  {toHumanTime(
                    data.Tracks.map((t) => t.Duration).reduce(
                      (a, b) => a + b,
                      0
                    )
                  )}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        <Divider mb="xs" />
        <ScrollArea style={{ height: "27rem" }} type="hover">
          {winReady && <DragAndDropTrackList data={data.Tracks} />}
        </ScrollArea>
      </Card>
    </>
  );
}
