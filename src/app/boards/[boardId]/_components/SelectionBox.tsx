import { LayerType, Side, XYWH } from "@/app/types";
import { useBoundingBoxes } from "@/hooks/useBoudingBoxes";
import React, { memo } from "react";
import { useSelf, useStorage } from "../../../../../liveblocks.config";
import { cn } from "@/lib/utils";

const HANDLE_WIDTH = 7;

interface SelectionBoxProps {
  onResizePointerDown: (corner: Side, initialBounds: XYWH) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  isResizing: boolean;
}

export const SelectionBox = memo(
  ({ onResizePointerDown, onPointerDown, isResizing }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const isTextLayer = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type === LayerType.Text
    );

    const bounds: XYWH | null = useBoundingBoxes();

    if (bounds === null) return null;

    const { x, y, width, height } = bounds;

    const selection_handle =
      "fill-orange-100 stroke-[1] stroke-primary rounded-md";

    return (
      <>
        <rect
          x={0}
          y={0}
          stroke="1"
          width={width}
          height={height}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerDown(e);
          }}
          className={cn(
            "stroke-primary fill-transparent",
            !isResizing && "cursor-move"
          )}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        />

        {isShowingHandles && (
          <>
            <rect
              className={selection_handle}
              x={0}
              y={0}
              rx={1.9}
              ry={1.9}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${x - HANDLE_WIDTH / 2}px, ${
                  y - HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizePointerDown(Side.Top + Side.Left, bounds);
              }}
            />

            {!isTextLayer && (
              <rect
                className={selection_handle}
                x={0}
                y={0}
                rx={1.9}
                ry={1.9}
                style={{
                  cursor: "ns-resize",
                  width: `${HANDLE_WIDTH}px`,
                  height: `${HANDLE_WIDTH}px`,
                  transform: `translate(${
                    x + width / 2 - HANDLE_WIDTH / 2
                  }px, ${y - HANDLE_WIDTH / 2}px)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onResizePointerDown(Side.Top, bounds);
                }}
              />
            )}

            <rect
              className={selection_handle}
              x={0}
              y={0}
              rx={1.9}
              ry={1.9}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${x - HANDLE_WIDTH / 2 + width}px, ${
                  y - HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizePointerDown(Side.Top + Side.Right, bounds);
              }}
            />

            {!isTextLayer && (
              <rect
                className={selection_handle}
                x={0}
                y={0}
                rx={1.9}
                ry={1.9}
                style={{
                  cursor: "ew-resize",
                  width: `${HANDLE_WIDTH}px`,
                  height: `${HANDLE_WIDTH}px`,
                  transform: `translate(${x - HANDLE_WIDTH / 2 + width}px, ${
                    y + height / 2 - HANDLE_WIDTH / 2
                  }px)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onResizePointerDown(Side.Right, bounds);
                }}
              />
            )}

            <rect
              className={selection_handle}
              x={0}
              y={0}
              rx={1.9}
              ry={1.9}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${x - HANDLE_WIDTH / 2 + width}px, ${
                  y - HANDLE_WIDTH / 2 + height
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizePointerDown(Side.Bottom + Side.Right, bounds);
              }}
            />

            {!isTextLayer && (
              <rect
                className={selection_handle}
                x={0}
                y={0}
                rx={1.9}
                ry={1.9}
                style={{
                  cursor: "ns-resize",
                  width: `${HANDLE_WIDTH}px`,
                  height: `${HANDLE_WIDTH}px`,
                  transform: `translate(${
                    x + width / 2 - HANDLE_WIDTH / 2
                  }px, ${y - HANDLE_WIDTH / 2 + height}px)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onResizePointerDown(Side.Bottom, bounds);
                }}
              />
            )}

            <rect
              className={selection_handle}
              x={0}
              y={0}
              rx={1.9}
              ry={1.9}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${x - HANDLE_WIDTH / 2}px, ${
                  y - HANDLE_WIDTH / 2 + height
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizePointerDown(Side.Bottom + Side.Left, bounds);
              }}
            />

            {!isTextLayer && (
              <rect
                className={selection_handle}
                x={0}
                y={0}
                rx={1.9}
                ry={1.9}
                style={{
                  cursor: "ew-resize",
                  width: `${HANDLE_WIDTH}px`,
                  height: `${HANDLE_WIDTH}px`,
                  transform: `translate(${x - HANDLE_WIDTH / 2}px, ${
                    y - HANDLE_WIDTH / 2 + height / 2
                  }px)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onResizePointerDown(Side.Left, bounds);
                }}
              />
            )}
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
