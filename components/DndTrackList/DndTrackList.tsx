"use client";

import { Track } from "@/types/socket";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Track as TrackComponent } from "../Track/Track";

function reorder(
  list: Iterable<unknown> | ArrayLike<unknown>,
  startIndex: number,
  endIndex: number,
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function Item({
  index,
  provided,
  item,
  isDragging,
}: {
  provided: any;
  item: Track;
  isDragging?: boolean;
  index?: number;
}) {
  return (
    <div
      {...provided.draggableProps}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
      className={`item ${isDragging ? "is-dragging" : ""}`}
    >
      <TrackComponent
        dragHandleProps={provided.dragHandleProps}
        track={item}
        index={index}
        hoverable
        withRemove
        showRequestedBy
        mode="skipTo"
      />
    </div>
  );
}

type DndTrackListProps = {
  baseTracks: Track[];
  onMove: (from: number, to: number) => void;
  height: number;
};

export function DndTrackList({
  baseTracks,
  onMove,
  height,
}: DndTrackListProps) {
  const [tracks, setTracks] = useState<Track[]>(baseTracks);

  useEffect(() => {
    setTracks(baseTracks);
  }, [baseTracks]);

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
      result.destination.index,
    );
    setTracks(newItems as Track[]);
    onMove(result.source.index, result.destination?.index ?? 0);
  }

  return (
    <>
      <style>
        {`
      .height-preserving-container:empty {
        min-height: calc(var(--child-height));
        box-sizing: border-box;
        }
    `}
      </style>

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
            <Virtuoso
              scrollerRef={provided.innerRef as any}
              components={{
                Item: HeightPreservingItem,
              }}
              data={tracks}
              style={{ height }}
              itemContent={(index, item) => {
                return (
                  <Draggable draggableId={item.Id} index={index} key={item.Id}>
                    {(provided) => (
                      <Item
                        index={index}
                        provided={provided}
                        item={item}
                        isDragging={false}
                      />
                    )}
                  </Draggable>
                );
              }}
            />
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

function HeightPreservingItem({ children, ...props }: any) {
  const [size, setSize] = useState(0);
  const knownSize = props["data-known-size"];
  useEffect(() => {
    setSize((prevSize) => {
      return knownSize == 0 ? prevSize : knownSize;
    });
  }, [knownSize]);
  return (
    <div
      {...props}
      className="height-preserving-container"
      style={{
        "--child-height": `${size}px`,
      }}
    >
      {children}
    </div>
  );
}
