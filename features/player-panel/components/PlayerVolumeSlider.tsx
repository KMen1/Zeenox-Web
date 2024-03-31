import { Slider } from "@/components/ui/slider";
import { botTokenAtom, volumeAtom } from "@/stores/atoms";
import { setVolume } from "@/utils/actions";
import { withNotification } from "@/utils/withNotification";
import { IconVolume2 } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export function PlayerVolumeSlider() {
  const token = useAtomValue(botTokenAtom);
  const volume = useAtomValue(volumeAtom);
  const [volumeLocal, setVolumeLocal] = useState(volume);

  useEffect(() => {
    setVolumeLocal(volume);
  }, [volume]);

  return (
    <div className="flex w-[120px] flex-nowrap items-center gap-2">
      <IconVolume2 size={25} color="white" />
      <Slider
        step={1}
        max={100}
        value={[volumeLocal ?? 0]}
        onValueChange={(v) => setVolumeLocal(v[0])}
        onValueCommit={async (v) =>
          withNotification(await setVolume(token, v[0]))
        }
      />
    </div>
  );
}
