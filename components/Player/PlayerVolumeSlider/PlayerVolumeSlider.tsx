import { useActions } from "@/components/Providers/ActionProvider";
import { usePlayerVolume } from "@/components/Providers/PlayerVolumeProvider";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { Slider } from "@mantine/core";
import { IconExclamationMark, IconVolume } from "@tabler/icons-react";

export function PlayerVolumeSlider() {
  const { setVolume } = useActions();
  const { volume } = usePlayerVolume();

  function sv(v: number) {
    const id = `volume-${Date.now()}`;
    showNotification(id, "Changing volume", null, true);
    setVolume(v).then((res) => {
      if (res.success) {
        updateNotification(
          id,
          "Changed volume",
          <IconVolume />,
          "green",
          `Volume changed to ${v}%`
        );
      } else {
        updateNotification(
          id,
          "Failed to change volume",
          <IconExclamationMark />,
          "red",
          res.error!
        );
      }
    });
  }

  return (
    <Slider
      defaultValue={volume ?? 0}
      color="blue"
      onChangeEnd={(v) => sv(v)}
    />
  );
}
