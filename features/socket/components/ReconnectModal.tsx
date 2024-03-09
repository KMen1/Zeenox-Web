import { Button, Text } from "@mantine/core";
import { IconPlugConnectedX, IconRefresh } from "@tabler/icons-react";
import { CardModal } from "../../../components/CardModal/CardModal";

type ReconnectModalProps = {
  opened: boolean;
};

export function ReconnectModal({ opened }: ReconnectModalProps) {
  return (
    <CardModal
      opened={opened}
      onClose={() => {}}
      title="Disconnected from server!"
      icon={<IconPlugConnectedX size={30} />}
      groups={[
        {
          content: (
            <>
              <Text size="xs" ta="center">
                Seems like you have been disconnected from the server. This can
                happen due to a network error, the server being restarted or
                because of inactivity.
              </Text>
              <Text size="xs" ta="center">
                You can try to reconnect to the server, but if the server has
                been restarted, your session will be lost.
              </Text>
              <Text size="xs" ta="center">
                Make sure to be in a voice channel before starting a new
                session.
              </Text>
            </>
          ),
          withBorder: true,
        },
        {
          content: (
            <Button
              variant="light"
              w="100%"
              onClick={() => {
                window.location.reload();
              }}
              leftSection={<IconRefresh size={20} />}
            >
              Reconnect
            </Button>
          ),
          withBorder: false,
        },
      ]}
    />
  );
}
