"use client";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useSocketAction } from "../SocketProvider";

export default function PlayerWidgetLikeSong() {
  const performAction = useSocketAction()!;

  const like = useCallback(() => void performAction("like"), [performAction]);
  return (
    <button onClick={like}>
      <FontAwesomeIcon
        icon={faHeart}
        size="lg"
        color="#1bc458"
        className="transition-all duration-100 ease-in-out hover:text-green-700"
      />
    </button>
  );
}
