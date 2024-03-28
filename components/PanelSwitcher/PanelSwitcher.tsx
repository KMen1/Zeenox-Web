"use client";

type PanelSwitcherProps = {
  selected: string;
  panels: {
    [key: string]: JSX.Element;
  };
};

export function PanelSwitcher({ selected, panels }: PanelSwitcherProps) {
  return panels[selected];
}
