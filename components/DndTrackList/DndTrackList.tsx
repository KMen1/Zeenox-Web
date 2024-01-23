"use client";

import { ActionResult, type TrackData } from "@/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
} from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { Track } from "../Track/Track";
import { FixedSizeList, areEqual } from "react-window";
import { useAtomValue } from "jotai";
import { actionFetchAtom } from "@/utils/atoms";

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
  item: TrackData;
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
      <Track track={item} index={index} withControls />
    </div>
  );
}

export function DndTrackList({
  baseTracks,
  onMove,
}: {
  baseTracks: TrackData[];
  onMove: (from: number, to: number) => Promise<ActionResult>;
}) {
  const [tracks, setTracks] = useState<TrackData[]>(baseTracks);
  const { skipToTrack, removeTrack, moveTrack } = useAtomValue(actionFetchAtom);

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
            <Track
              track={item}
              index={index}
              withControls
              hoverable
              onSkipTo={skipToTrack}
              onRemove={removeTrack}
              onMove={moveTrack}
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
    setTracks(newItems as TrackData[]);
    onMove(result.source.index, result.destination?.index ?? 0).then(() => {});
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
