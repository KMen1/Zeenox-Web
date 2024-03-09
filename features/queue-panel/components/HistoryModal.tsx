import { historyAtom } from "@/stores/atoms";
import { Track } from "@/types/socket";
import { IconHistory } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { CardModal } from "../../../components/CardModal/CardModal";
import { MemoizedList } from "../../../components/MemoizedList/MemoizedList";
import { Track as TrackComponent } from "../../../components/Track/Track";

type HistoryModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function HistoryModal({ opened, onClose }: HistoryModalProps) {
  const history = useAtomValue(historyAtom);

  return (
    <CardModal
      opened={opened}
      onClose={onClose}
      title="History"
      icon={<IconHistory size={30} />}
      groups={[
        {
          withBorder: true,
          title: history?.length
            ? `Listing ${history.length} songs`
            : "No songs available!",
          content:
            history && history?.length > 0 ? (
              <MemoizedList<Track>
                height={435}
                width="100%"
                items={history || []}
                itemHeight={52}
                renderItem={(item) => {
                  return (
                    <TrackComponent
                      track={item}
                      hoverable
                      mode="play"
                      withAdd
                    />
                  );
                }}
              />
            ) : null,
        },
      ]}
    />
  );
}
