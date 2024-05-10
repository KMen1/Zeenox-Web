"use client";

import { Track as TrackComponent } from "@/components/Track/Track";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { botTokenAtom, historyAtom } from "@/stores/atoms";
import {
  IconArrowsShuffle,
  IconCopyOff,
  IconHistory,
  IconRotateClockwise,
  IconTrash,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { Virtuoso } from "react-virtuoso";
import { clearQueue, reverseQueue, shuffleQueue } from "../../utils/actions";
import { withNotification } from "../../utils/withNotification";

type QueuePanelMenuProps = {
  disabled?: boolean;
};

export function QueuePanelMenu({ disabled }: QueuePanelMenuProps) {
  const token = useAtomValue(botTokenAtom);
  const history = useAtomValue(historyAtom);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        color="blue"
        onClick={async () => withNotification(await shuffleQueue(token))}
        aria-label="Shuffle"
        disabled={disabled}
        className="grow"
      >
        <div className="flex items-center gap-2">
          <IconArrowsShuffle size="1.1rem" />
          Shuffle
        </div>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        color="blue"
        onClick={async () => withNotification(await reverseQueue(token))}
        aria-label="Reverse"
        disabled={disabled}
        className="grow"
      >
        <div className="flex items-center gap-2">
          <IconRotateClockwise size="1.1rem" />
          Reverse
        </div>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        color="yellow"
        onClick={async () => withNotification(await reverseQueue(token))}
        aria-label="Distinct"
        disabled={disabled}
        className="grow"
      >
        <div className="flex items-center gap-2">
          <IconCopyOff size="1.1rem" />
          Distinct
        </div>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        color="red"
        onClick={async () => withNotification(await clearQueue(token))}
        aria-label="Clear"
        disabled={disabled}
        className="grow"
      >
        <div className="flex items-center gap-2">
          <IconTrash size="1.1rem" />
          Clear
        </div>
      </Button>
      <Dialog>
        <DialogTrigger className="ml-auto" asChild>
          <Button
            variant="secondary"
            size="sm"
            color="blue"
            aria-label="Open history"
            className="grow"
          >
            <div className="flex items-center gap-2">
              <IconHistory size="1.1rem" />
              History
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {history?.length
                ? `Previously played songs`
                : "No songs available!"}
            </DialogTitle>
            <DialogDescription>
              Listing {history?.length} songs
            </DialogDescription>
          </DialogHeader>
          <Virtuoso
            style={{ height: "435px" }}
            data={history || []}
            itemContent={(_, item) => {
              return (
                <TrackComponent track={item} hoverable mode="play" withAdd />
              );
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
