import { EllipseLayer, Layer } from "@/app/types";
import { rgbToHex } from "@/lib/utils";
import React from "react";

interface EllipseProps {
  layer: EllipseLayer;
  layerId: string;
  selectionColor?: string;
  onPointerDown: (e: any, layerId: string) => void;
}

export const Ellipse: React.FC<EllipseProps> = ({
  layer,
  layerId,
  onPointerDown,
  selectionColor,
}) => {
  const { width, height, x, y, fill, strokeWidth, stroke, opacity } = layer;

  return (
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
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
