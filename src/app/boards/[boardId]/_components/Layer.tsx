import React, { memo } from "react";
import { useStorage } from "../../../../../liveblocks.config";
import { CanvasMode, Color, LayerType } from "@/app/types";
import { Rectangle } from "./layers/Rectangle";

export const LayerPreview = memo(
  ({
    layerId,
    canvasMode,
    onPointerDown,
    selectionColor,
  }: {
    layerId: string;
    canvasMode: CanvasMode;
    selectionColor?: string;
    onPointerDown: (
      e: React.MouseEvent<SVGRectElement, MouseEvent>,
      layerId: string
    ) => void;
  }) => {
    const layer = useStorage((root) => root.layers.get(layerId));
    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            layer={layer}
            layerId={layerId}
            onPointerDown={onPointerDown}
            selectionColor={selectionColor}
          />
        );
    }
  }
);
