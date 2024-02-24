import { CSSProperties, memo, useEffect, useRef } from "react";
import { FixedSizeList, VariableSizeList, areEqual } from "react-window";

type MemoizedListProps<T> = {
  items: T[];
  height: number | string;
  width: number | string;
  itemHeight?: number | ((item: T, index: number) => number);
  variableSize?: boolean;
  renderItem: (item: T, index: number) => any;
};

export function MemoizedList<T>({
  height,
  width,
  itemHeight,
  items,
  variableSize,
  renderItem,
}: MemoizedListProps<T>) {
  const ref = useRef<VariableSizeList<any>>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [items]);

  function renderRow({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) {
    if (items === null) return null;
    const item = items[index];
    return (
      <div key={index} style={style}>
        {renderItem(item, index)}
      </div>
    );
  }

  function getItemHeight(index: number): number {
    if (items === null) return 0;
    if (typeof itemHeight === "function")
      return itemHeight(items[index], index);
    return itemHeight || 100;
  }

  const row = memo(renderRow, areEqual);

  return variableSize ? (
    <VariableSizeList
      height={height}
      itemCount={items.length}
      itemSize={getItemHeight}
      width={width}
      ref={ref}
    >
      {row}
    </VariableSizeList>
  ) : (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={(itemHeight as number) || 100}
      width={width}
    >
      {row}
    </FixedSizeList>
  );
}
