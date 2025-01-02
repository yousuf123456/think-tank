import { RectangleLayer } from "@/app/types";
import { rgbToHex } from "@/lib/utils";
import React from "react";
import rgbHex from "rgb-hex";

interface RectangleProps {
  layer: RectangleLayer;
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
  const { width, height, x, y, fill, strokeWidth, stroke, opacity } = layer;

  return (
    <rect
      x={0}
      y={0}
      rx={8}
      ry={8}
      width={width}
      height={height}
      opacity={opacity}
      fill={rgbToHex(fill)}
      strokeWidth={strokeWidth}
      className="hover:cursor-move"
      stroke={selectionColor ?? rgbToHex(stroke)}
      onPointerDown={(e) => onPointerDown(e, layerId)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
};
