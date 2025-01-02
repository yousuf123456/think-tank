import React from "react";
import getStroke from "perfect-freehand";
import { cn, getSvgPathFromStroke, rgbToHex } from "@/lib/utils";
import { Layer, LayerType, PathLayer } from "@/app/types";

interface PathProps {
  isDrawing: boolean;
  layerId?: string;
  layer?: PathLayer;
  isDraft?: boolean;
  fill?: string;
  points?: number[][];
  x?: number;
  y?: number;
  onPointerDown?: (e: any, layerId: string) => void;
}

export const Path: React.FC<PathProps> = ({
  layer,
  isDraft,
  isDrawing,
  x,
  y,
  points,
  fill,
  layerId,
  onPointerDown,
}) => {
  return (
    <path
      onPointerDown={(e) =>
        onPointerDown && layerId && !isDraft && onPointerDown(e, layerId)
      }
      d={getSvgPathFromStroke(
        getStroke(isDraft ? points! : layer?.points!, {
          size: 10,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${isDraft ? x : layer?.x}px, ${
          isDraft ? y : layer?.y
        }px)`,
      }}
      x={0}
      y={0}
      className={cn(!isDrawing && "hover:cursor-move")}
      fill={rgbToHex(isDraft ? fill! : layer?.fill!)}
      stroke={rgbToHex(isDraft ? fill! : layer?.stroke!)}
      strokeWidth={isDraft ? 2 : layer?.strokeWidth!}
    />
  );
};
