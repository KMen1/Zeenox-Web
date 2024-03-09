import { Track } from "@/types/socket";
import { IconPlaylist } from "@tabler/icons-react";
import { CardModal } from "../CardModal/CardModal";
import { MemoizedList } from "../MemoizedList/MemoizedList";
import { Track as TrackComponent } from "../Track/Track";

type PlaylistModalProps = {
  opened: boolean;
  onClose: () => void;
  name: string | null | undefined;
  tracks: Track[];
};

export function PlaylistModal({
  opened,
  onClose,
  name,
  tracks,
}: PlaylistModalProps) {
  return (
    <CardModal
      title={name || "Resume Session"}
      icon={<IconPlaylist size={30} />}
      opened={opened}
      onClose={onClose}
      groups={[
        {
          title: `Listing ${tracks.length} songs`,
          withBorder: true,
          content: (
            <MemoizedList<Track>
              height={435}
              width="100%"
              items={tracks}
              itemHeight={50}
              renderItem={(item) => {
                return (
                  <TrackComponent track={item} hoverable mode="play" withAdd />
                );
              }}
            />
          ),
        },
      ]}
    />
  );
}
