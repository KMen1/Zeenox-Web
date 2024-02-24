"use client";

import { botTokenAtom } from "@/utils/atoms";
import { Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowsShuffle,
  IconCopyOff,
  IconHistory,
  IconRotateClockwise,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { HistoryModal } from "../Modals/HistoryModal";
import { clearQueue, reverseQueue, shuffleQueue } from "../actions";
import { withNotification } from "../withNotification";
import classes from "./QueuePanelMenu.module.css";

type QueuePanelMenuProps = {
  disabled?: boolean;
};

export function QueuePanelMenu({ disabled }: QueuePanelMenuProps) {
  const [historyModalOpened, { open, close }] = useDisclosure(false);
  const token = useAtomValue(botTokenAtom);

  return (
    <>
      <Group align="center" gap="xs" grow>
        <Button
          variant="light"
          size="sm"
          color="blue"
          onClick={async () => withNotification(await shuffleQueue(token))}
          aria-label="Shuffle"
          leftSection={<IconArrowsShuffle size="1.1rem" />}
          disabled={disabled}
          classNames={classes}
        >
          Shuffle
        </Button>
        <Button
          variant="light"
          size="sm"
          color="blue"
          onClick={async () => withNotification(await reverseQueue(token))}
          aria-label="Reverse"
          leftSection={<IconRotateClockwise size="1.1rem" />}
          disabled={disabled}
          classNames={classes}
        >
          Reverse
        </Button>
        <Button
          variant="light"
          size="sm"
          color="yellow"
          onClick={async () => withNotification(await reverseQueue(token))}
          aria-label="Distinct"
          leftSection={<IconCopyOff size="1.1rem" />}
          disabled={disabled}
          classNames={classes}
        >
          Distinct
        </Button>
        <Button
          variant="light"
          size="sm"
          color="red"
          onClick={async () => withNotification(await clearQueue(token))}
          aria-label="Clear"
          leftSection={<IconTrash size="1.1rem" />}
          disabled={disabled}
          classNames={classes}
        >
          Clear
        </Button>
        <Button
          variant="light"
          size="sm"
          color="blue"
          onClick={open}
          aria-label="Open history"
          leftSection={<IconHistory size="1.1rem" />}
          classNames={classes}
        >
          History
        </Button>
      </Group>
      <HistoryModal opened={historyModalOpened} onClose={close} />
    </>
  );
}
