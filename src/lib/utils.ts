import { Color, Layer, Point, Side, XYWH } from "@/app/types";
import { twMerge } from "tailwind-merge";
import rgbHex from "rgb-hex";

import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Camera = {
  x: number;
  y: number;
};

export function pointerEventToCursorCoords(
  e:
    | React.MouseEvent<SVGSVGElement, MouseEvent>
    | React.MouseEvent<SVGRectElement, MouseEvent>,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export const rgbToHex = (rgb: Color) => {
  return `#${rgbHex(rgb.r, rgb.g, rgb.b)}`;
};

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function resizeBounds(corner: Side, bounds: XYWH, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  result.x = result.x + 6;
  result.y = result.y + 6;
  result.width = result.width - 12;
  result.height = result.height - 12;

  return result;
}

export function translatePoints(now: Point, prev: Point, layer: Layer): Point {
  const deltaX = now.x - prev.x;
  const deltaY = now.y - prev.y;

  const translatedPoints = {
    x: layer.x + deltaX,
    y: layer.y + deltaY,
  };

  return translatedPoints;
}

export function getIntersectingLayerIds(
  layerIds: Readonly<string[]>,
  layers: ReadonlyMap<string, Layer>,
  origin: Point,
  current: Point
): string[] {
  let intersectingLayerIds: string[] = [];

  const selectionNetInfo = {
    left: Math.min(origin.x, current.x),
    right: Math.max(origin.x, current.x),
    top: Math.min(origin.y, current.y),
    bottom: Math.max(origin.y, current.y),
  };

  layerIds.map((layerId) => {
    const layer = layers.get(layerId);
    if (!layer) return;

    const { x, y, width, height } = layer;

    if (
      x > selectionNetInfo.left &&
      x + width < selectionNetInfo.right &&
      y > selectionNetInfo.top &&
      y + height < selectionNetInfo.bottom
    ) {
      intersectingLayerIds.push(layerId);
    }
  });

  return intersectingLayerIds;
}

export function getResizeCursor(side: number) {
  if (side === 5 || side === 10) {
    return "cursor-nwse-resize";
  }
  if (side === 1 || side === 2) {
    return "cursor-ns-resize";
  }
  if (side === 9 || side === 6) {
    return "cursor-nesw-resize";
  }
  if (side === 8 || side === 4) {
    return "cursor-ew-resize";
  }
}
