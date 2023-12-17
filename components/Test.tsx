"use client";

import {
  Avatar,
  BackgroundImage,
  Box,
  Card,
  Center,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import styles from "./Test.module.css";
import Image from "next/image";

export function Test() {
  return (
    <>
      <Card classNames={styles} w={350} p="1.25rem">
        <Stack gap="sm">
          <Text fw={700} c="white" size="1.25rem">
            Now Playing
          </Text>
          <Group gap="sm">
            <Image
              src={
                "https://images.genius.com/c08136674232240552013a5e403ce84f.1000x1000x1.jpg"
              }
              width={40}
              height={40}
              className={styles.trackImage}
              alt={""}
            />
            <Stack gap={0}>
              <Text c="white" size="1.125rem" fw={600} lh={1.4} lineClamp={1}>
                OSZTRIGA
              </Text>
              <Text size="0.875rem" fw={500} lh={1.4} lineClamp={1}>
                DESH
              </Text>
            </Stack>
          </Group>
          <Group justify="space-between">
            <Group gap={7}>
              <Image
                src={
                  "https://cdn.discordapp.com/avatars/132797923049209856/338c6f54f737a526d486880febdaec6b.png?size=128&w=48&q=75"
                }
                width={20}
                height={20}
                alt={""}
                style={{ borderRadius: "50%" }}
              />
              <Text c="white" size="0.875rem">
                Olivér (kmen)
              </Text>
            </Group>
            <Text c="white" size="0.875rem">
              12 seconds ago
            </Text>
          </Group>
        </Stack>
      </Card>
      <Card
        classNames={styles}
        style={{ background: "black" }}
        w={350}
        p="1.25rem"
      >
        <Stack gap="sm">
          <Text fw={700} c="white" size="1.25rem">
            Paused playback
          </Text>
          <Group justify="space-between">
            <Group gap={7}>
              <Image
                src={
                  "https://cdn.discordapp.com/avatars/132797923049209856/338c6f54f737a526d486880febdaec6b.png?size=128&w=48&q=75"
                }
                width={20}
                height={20}
                alt={""}
                style={{ borderRadius: "50%" }}
              />
              <Text c="white" size="0.875rem">
                Olivér (kmen)
              </Text>
            </Group>
            <Text c="white" size="0.875rem">
              12 seconds ago
            </Text>
          </Group>
        </Stack>
      </Card>
    </>
  );
}
