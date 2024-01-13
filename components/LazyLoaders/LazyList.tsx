import { FixedSizeList, areEqual } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Skeleton } from "@mantine/core";
import { memo } from "react";

export function LazyList<T>({
  items,
  itemFactory,
  totalCount,
  loadMoreItems,
  hasMoreItems,
  isLoadingNextPage,
  height,
  itemHeight,
}: {
  items: T[];
  itemFactory: ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => JSX.Element;
  totalCount: number;
  loadMoreItems: () => Promise<void>;
  hasMoreItems: boolean;
  isLoadingNextPage: boolean;
  height: number;
  itemHeight: number;
}) {
  const loadNext = isLoadingNextPage ? () => {} : loadMoreItems;
  const isItemLoaded = (index: number) => !hasMoreItems || index < items.length;

  const nextItem = memo(function item({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <Skeleton w="100%" h={itemHeight} />
        </div>
      );
    }

    return itemFactory({ index, style });
  },
  areEqual);

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={totalCount}
      loadMoreItems={loadNext}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          className="List"
          height={height}
          itemCount={totalCount}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {nextItem}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
