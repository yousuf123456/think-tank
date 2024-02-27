import { Point } from "@/app/types";
import React from "react";

export const SelectionNet = ({
  origin,
  current,
}: {
  origin: Point;
  current: Point;
}) => {
  const x = Math.min(origin.x, current.x);
  const y = Math.min(origin.y, current.y);

  const width = Math.max(origin.x, current.x) - x;
  const height = Math.max(origin.y, current.y) - y;

  return (
    <rect
      x={x}
      y={y}
      stroke={"1"}
      width={width}
      height={height}
      fillOpacity={0.1}
      className="stroke-primary fill-orange-500"
    />
  );
};
