import {
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  Side,
  XYWH,
} from "@/app/types";
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
  e: React.PointerEvent | React.MouseEvent<SVGRectElement, MouseEvent>,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export const rgbToHex = (rgb: Color | string) => {
  if (!rgb) return "";

  if (typeof rgb === "string") return rgb;

  return `#${rgbHex(rgb.r, rgb.g, rgb.b)}`;
};

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function resizeBounds(
  corner: Side,
  bounds: XYWH,
  point: Point,
  maintainSquareRatio?: boolean
) {
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

  // If shift is pressed, maintain aspect ratio
  if (maintainSquareRatio) {
    if (result.width < result.height) {
      result.width = result.height;
    } else {
      result.height = result.width;
    }

    result.x = bounds.x;
    result.y = bounds.y;
  }

  result.x = result.x + 6;
  result.y = result.y + 6;
  result.width = result.width - 12;
  result.height = result.height - 12;

  return result;
}

export function translatePoints(
  now: Point,
  prev: Point,
  layer: Layer
): Point | { end: Point; start: Point } {
  const deltaX = now.x - prev.x;
  const deltaY = now.y - prev.y;

  let translatedPoints;
  if (layer.type === LayerType.Line) {
    translatedPoints = {
      end: {
        x: layer.end.x + deltaX,
        y: layer.end.y + deltaY,
      },
      start: {
        x: layer.start.x + deltaX,
        y: layer.start.y + deltaY,
      },
    };
  } else {
    translatedPoints = {
      x: layer.x + deltaX,
      y: layer.y + deltaY,
    };
  }

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

    if (layer.type === LayerType.Line) return;

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

export function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export function penPointsToPathLayer(
  points: number[][],
  color: Color
): PathLayer {
  if (points.length < 2) {
    throw new Error("Can't transform points with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;
    if (left > x) {
      left = x;
    }
    if (top > y) {
      top = y;
    }
    if (right < x) {
      right = x;
    }
    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    stroke: color,
    strokeWidth: 2,
    opacity: 1,
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}
