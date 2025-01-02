import React from "react";
import { DiamondLayer } from "@/app/types";
import { rgbToHex } from "@/lib/utils";

interface DiamondProps {
  layer: DiamondLayer;
  layerId: string;
  selectionColor?: string;
  onPointerDown: (e: any, layerId: string) => void;
}

export const Diamond: React.FC<DiamondProps> = ({
  layer,
  layerId,
  onPointerDown,
  selectionColor,
}) => {
  const { width, height, x, y, fill, strokeWidth, stroke, opacity } = layer;

  const centerX = width / 2;
  const centerY = height / 2;

  const points = [
    [centerX, 0],
    [width, centerY],
    [centerX, height],
    [0, centerY],
  ];

  const pointsString = points.map((point) => point.join(",")).join(" ");

  return (
    <polygon
      opacity={opacity}
      points={pointsString}
      fill={rgbToHex(fill)}
      strokeWidth={strokeWidth}
      className="hover:cursor-move"
      stroke={selectionColor ?? rgbToHex(stroke)}
      onPointerDown={(e) => onPointerDown(e, layerId)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
};
