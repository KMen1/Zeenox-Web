import { PlayerResumeSession } from "@/types/socket";
import { Modal, Group, Stack, Button, Text } from "@mantine/core";
import {
  IconClockPlay,
  IconDeviceFloppy,
  IconClock,
} from "@tabler/icons-react";
import { Track } from "../Track/Track";
import TimeAgo from "react-timeago";
import classes from "./ResumeSessionModal.module.css";

export function ResumeSessionModal({
  resumeData,
  opened,
  onClose,
  onResume,
}: {
  resumeData: PlayerResumeSession;
  opened: boolean;
  onClose: () => void;
  onResume: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Text>
            <IconClockPlay size={30} />
          </Text>
          <Text fw={700}>Resume Available</Text>
        </Group>
      }
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      classNames={{
        content: classes.content,
      }}
    >
      <Stack gap="sm">
        <Stack gap="xs" className={classes.infoGroup}>
          <Group wrap="nowrap" gap="xs">
            <Text>
              <IconDeviceFloppy size={30} />
            </Text>
            <Text size="xs">
              Seems like the last session in this server was not fully finished
              and has been saved automatically!
            </Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <Text>
              <IconClock size={30} />
            </Text>
            <Text size="xs">
              Last session was saved{" "}
              <TimeAgo date={new Date(resumeData.Timestamp * 1000)} />
            </Text>
          </Group>
        </Stack>

        <Stack gap="xs" className={classes.infoGroup}>
          <Text fw={600}>The following will be played</Text>
          <Track small track={resumeData.CurrentTrack} />
        </Stack>
        {resumeData.QueueLength > 0 ? (
          <Stack gap="xs" className={classes.infoGroup}>
            <Text fw={600}>The following will be added to the queue</Text>
            <Stack gap={0}>
              {resumeData.UpcomingFewTracks.map((track) => (
                <Track key={track.Url} small track={track} />
              ))}
              <Text ta="right">
                and{" "}
                {resumeData.QueueLength - resumeData.UpcomingFewTracks.length}{" "}
                more...
              </Text>
            </Stack>
          </Stack>
        ) : null}

        <Button
          leftSection={<IconClockPlay size={20} />}
          onClick={onResume}
          variant="light"
        >
          Resume Session
        </Button>
      </Stack>
    </Modal>
  );
}
