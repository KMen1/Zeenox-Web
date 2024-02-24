import { initAtom } from "@/utils/atoms";
import { Button, Group, Stack, Text } from "@mantine/core";
import {
  IconClock,
  IconClockPlay,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import ReactTimeago from "react-timeago";
import { CardModal } from "../CardModal/CardModal";
import { Track } from "../Track/Track";

type ResumeSessionModalProps = {
  opened: boolean;
  onClose: () => void;
  onResume: () => void;
  onDelete: () => void;
};

export function ResumeSessionModal({
  opened,
  onClose,
  onResume,
  onDelete,
}: ResumeSessionModalProps) {
  const resumeSession = useAtomValue(initAtom)!.ResumeSession!;

  return (
    <CardModal
      title={"Resume Available"}
      icon={<IconClockPlay size={30} />}
      opened={opened}
      onClose={onClose}
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
          content: <Track small track={resumeSession.CurrentTrack} />,
        },
        {
          title: "The following will be added to the queue",
          withBorder: true,
          content: (
            <>
              {resumeSession.QueueLength > 0 ? (
                <Stack gap={0}>
                  {resumeSession.UpcomingFewTracks.map((track) => (
                    <Track key={track.Url} small track={track} />
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
  );
}
