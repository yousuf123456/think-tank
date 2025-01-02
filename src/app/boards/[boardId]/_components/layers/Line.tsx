import { LineLayer, Layer } from "@/app/types";
import { rgbToHex } from "@/lib/utils";
import React from "react";

interface LineProps {
  layer: LineLayer;
  layerId: string;
  selectionColor?: string;
  onPointerDown: (e: any, layerId: string) => void;
}

export const Line: React.FC<LineProps> = ({
  layer,
  layerId,
  onPointerDown,
  selectionColor,
}) => {
  const { start, end, strokeWidth, stroke, opacity } = layer;

  return (
    <line
      x2={end.x}
      y2={end.y}
      x1={start.x}
      y1={start.y}
      opacity={opacity}
      strokeWidth={strokeWidth}
      className="hover:cursor-move"
      stroke={selectionColor ?? rgbToHex(stroke)}
      onPointerDown={(e) => onPointerDown(e, layerId)}
    />
  );
};
