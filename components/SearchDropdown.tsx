import { useEffect, useState } from "react";
import { Popover, Box, TextInput } from "@mantine/core";

type BasicTrackInfo = {
  Title: string;
  Author: string;
  Duration: number;
  Thumbnail: string;
  Url: string;
};

export default function SearchDropdown() {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<null | BasicTrackInfo[]>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!value.trim()) return setResult(null);
        const response = await fetch(`/api/search?q=${value}`);
        const data = (await response.json()) as BasicTrackInfo[];
        setResult(data);
      } catch (error) {
        console.error(error);
      }
    }
    void fetchData();
  }, [value]);

  return (
    <Box maw={340} mx="auto">
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transitionProps={{ transition: "pop" }}
      >
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <TextInput
              aria-label="Search for music"
              placeholder="Start typing to search for music"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") console.log("searching for", value);
              }}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown></Popover.Dropdown>
      </Popover>
    </Box>
  );
}
