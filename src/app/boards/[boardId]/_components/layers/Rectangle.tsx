import { Color, Layer } from "@/app/types";
import { rgbToHex } from "@/lib/utils";
import React from "react";
import rgbHex from "rgb-hex";

interface RectangleProps {
  layer: Layer;
  layerId: string;
  selectionColor?: string;
  onPointerDown: (e: any, layerId: string) => void;
}

export const Rectangle: React.FC<RectangleProps> = ({
  layer,
  layerId,
  onPointerDown,
  selectionColor,
}) => {
  const { width, height, x, y, fill } = layer;

  return (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={2}
      fill={rgbToHex(fill)}
      className="hover:cursor-move"
      stroke={selectionColor ?? "transparent"}
      onPointerDown={(e) => onPointerDown(e, layerId)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
};
