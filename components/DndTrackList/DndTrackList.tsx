"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
} from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { FixedSizeList, areEqual } from "react-window";
import { Track } from "@/types/socket";
import { Track as TrackComponent } from "../Track/Track";

function getStyle({ provided, style, isDragging }: any) {
  const combined = {
    ...style,
    ...provided.draggableProps.style,
  };

  const marginBottom = 8;
  const withSpacing = {
    ...combined,
    height: isDragging ? combined.height : combined.height - marginBottom,
    marginBottom,
  };
  return withSpacing;
}

function reorder(
  list: Iterable<unknown> | ArrayLike<unknown>,
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function Item({
  provided,
  item,
  style,
  isDragging,
  index,
}: {
  provided: any;
  item: Track;
  style?: any;
  isDragging?: boolean;
  index?: number;
}) {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({ provided, style, isDragging })}
      className={`item ${isDragging ? "is-dragging" : ""}`}
    >
      <TrackComponent
        track={item}
        index={index}
        withControls
        withMove
        withRemove
        withSkipTo
      />
    </div>
  );
}

export function DndTrackList({
  baseTracks,
  onMove,
}: {
  baseTracks: Track[];
  onMove: (from: number, to: number) => void;
}) {
  const [tracks, setTracks] = useState<Track[]>(baseTracks);

  useEffect(() => {
    setTracks(baseTracks);
  }, [baseTracks]);

  const Row = React.memo(function Row({ index, style }: any) {
    const item = tracks[index];
    return (
      <Draggable draggableId={item.Url!} index={index} key={item.Url}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getStyle({ provided, style })}
          >
            <TrackComponent
              track={item}
              index={index}
              withControls
              hoverable
              withSkipTo
              withRemove
              withMove
              dragHandleProps={provided.dragHandleProps}
            />
          </div>
        )}
      </Draggable>
    );
  }, areEqual);

  function onDragEnd(result: {
    destination: DraggableLocation | null | undefined;
    source: DraggableLocation;
  }) {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }

    const newItems = reorder(
      tracks,
      result.source.index,
      result.destination.index
    );
    setTracks(newItems as Track[]);
    onMove(result.source.index, result.destination?.index ?? 0);
  }

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        onDragEnd({ destination, source });
      }}
    >
      <Droppable
        droppableId="dnd-list"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <Item
            provided={provided}
            isDragging={snapshot.isDragging}
            item={tracks[rubric.source.index]}
          />
        )}
      >
        {(provided) => (
          <FixedSizeList
            height={435}
            itemCount={tracks?.length || 0}
            itemSize={50}
            width="100%"
            outerRef={provided.innerRef}
          >
            {Row}
          </FixedSizeList>
        )}
      </Droppable>
    </DragDropContext>
  );
}
