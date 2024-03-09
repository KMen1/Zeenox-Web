import { botTokenAtom, resumeSessionAtom } from "@/stores/atoms";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconClock,
  IconClockPlay,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import ReactTimeago from "react-timeago";
import { CardModal } from "../../../components/CardModal/CardModal";
import { Track } from "../../../components/Track/Track";
import {
  deletePreviousSession,
  resumePreviousSession,
} from "../../../utils/actions";

export function ResumeSessionModal() {
  const botToken = useAtomValue(botTokenAtom);
  async function onResume() {
    await resumePreviousSession(botToken);
  }

  async function onDelete() {
    await deletePreviousSession(botToken);
  }

  const resumeSession = useAtomValue(resumeSessionAtom);
  const [opened, { close }] = useDisclosure(resumeSession != null);

  return resumeSession ? (
    <CardModal
      title={"Resume Available"}
      icon={<IconClockPlay size={30} />}
      opened={opened}
      onClose={close}
      groups={[
        {
          withBorder: true,
          content: (
            <>
              <Group wrap="nowrap" gap="xs">
                <Text>
                  <IconDeviceFloppy size={30} />
                </Text>
                <Text size="xs">
                  Seems like the last session in this server was not fully
                  finished and has been saved automatically!
                </Text>
              </Group>
              <Group wrap="nowrap" gap="xs">
                <Text>
                  <IconClock size={30} />
                </Text>
                <Text size="xs">
                  Last session was saved{" "}
                  <ReactTimeago
                    date={new Date(resumeSession.Timestamp * 1000)}
                  />
                </Text>
              </Group>
            </>
          ),
        },
        {
          title: "The following will be played",
          withBorder: true,
          content: <Track track={resumeSession.CurrentTrack} mode="none" />,
        },
        {
          title: "The following will be added to the queue",
          withBorder: true,
          content: (
            <>
              {resumeSession.QueueLength > 0 ? (
                <Stack gap={0}>
                  {resumeSession.UpcomingFewTracks.map((track) => (
                    <Track key={track.Url} track={track} mode="none" />
                  ))}
                  {resumeSession.QueueLength >
                  resumeSession.UpcomingFewTracks.length ? (
                    <Text ta="right">
                      and{" "}
                      {resumeSession.QueueLength -
                        resumeSession.UpcomingFewTracks.length}{" "}
                      more...
                    </Text>
                  ) : null}
                </Stack>
              ) : null}
            </>
          ),
        },
        {
          content: (
            <Group grow>
              <Button
                leftSection={<IconClockPlay size={20} />}
                onClick={onResume}
                variant="light"
              >
                Resume Session
              </Button>
              <Button
                leftSection={<IconTrash size={20} />}
                onClick={onDelete}
                color="red"
                variant="light"
              >
                Delete Session
              </Button>
            </Group>
          ),
        },
      ]}
    />
  ) : null;
}
