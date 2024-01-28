import { useVolume } from "@/components/hooks";
import { volumeAtom } from "@/utils/atoms";
import { Slider } from "@mantine/core";
import { useAtomValue } from "jotai";

export function PlayerVolumeSlider() {
  const setVolume = useVolume();
  const volume = useAtomValue(volumeAtom);

  return (
    <Slider
      defaultValue={volume ?? 0}
      color="blue"
      onChangeEnd={(v) => setVolume(v)}
    />
  );
}
