import { actionFetchAtom, volumeAtom } from "@/utils/atoms";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { getErrorMessageFromCode } from "@/utils/utils";
import { Slider } from "@mantine/core";
import { IconExclamationMark, IconVolume } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

export function PlayerVolumeSlider() {
  const { setVolume } = useAtomValue(actionFetchAtom);
  const volume = useAtomValue(volumeAtom);

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
          "Unable to change volume",
          <IconExclamationMark />,
          "red",
          getErrorMessageFromCode(res.code!)
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
