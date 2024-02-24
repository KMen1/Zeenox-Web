import { Group, Modal, Stack, Text } from "@mantine/core";
import classes from "./CardModal.module.css";

type CardModalProps = {
  title: string;
  icon: React.ReactNode;
  opened: boolean;
  withCloseButton?: boolean;
  onClose: () => void;
  groups: ModalInfoGroup[];
};

type ModalInfoGroup = {
  title?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  withBorder?: boolean;
};

export function CardModal({
  title,
  icon,
  opened,
  withCloseButton = true,
  onClose,
  groups,
}: CardModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Text>{icon}</Text>
          <Text fw={700}>{title}</Text>
        </Group>
      }
      centered
      withCloseButton={withCloseButton}
      classNames={{
        content: classes.content,
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="sm">
        {groups
          .filter((group) => group.withBorder)
          .map((group, index) => (
            <Stack gap="xs" key={index} className={classes.infoGroup}>
              {(group.title || group.icon) && (
                <Group gap="xs">
                  {group.icon}
                  <Text fw={600}>{group.title}</Text>
                </Group>
              )}
              {group.content}
            </Stack>
          ))}
        {groups
          .filter((group) => !group.withBorder)
          .map((group, index) => (
            <div key={index}>{group.content}</div>
          ))}
      </Stack>
    </Modal>
  );
}
