"use client";

import cx from "clsx";
import { type TrackData } from "@/types";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import QueueWidgetTrack from "./QueueWidgetTrack";
import { useSocketAction } from "../SocketProvider";
import { useCallback, useEffect } from "react";
import classes from "./DragAndDropTrackList.module.css";

interface DndListProps {
  data: TrackData[];
}

export function DragAndDropTrackList({ data }: DndListProps) {
  const [state, handlers] = useListState(data);
  const performAction = useSocketAction()!;

  const move = useCallback(
    (from: number, to: number) => {
      void performAction("move", { from, to });
    },
    [performAction]
  );

  useEffect(() => {
    handlers.setState(data);
  }, [data, handlers]);

  const items = state.map((item, index) => (
    <Draggable
      key={`${index}.${item.Title}`}
      index={index}
      draggableId={`${index}.${item.Title}`}
    >
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <QueueWidgetTrack track={item} index={index} />
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        move(source.index, destination?.index ?? 0);
        handlers.reorder({ from: source.index, to: destination?.index ?? 0 });
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
