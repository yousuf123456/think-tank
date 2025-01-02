import React, { memo } from "react";
import { useStorage } from "../../../../../liveblocks.config";
import { CanvasMode, Color, LayerType } from "@/app/types";
import { Rectangle } from "./layers/Rectangle";
import { Path } from "./layers/Path";
import { Text } from "./layers/Text";
import { Ellipse } from "./layers/Ellipse";
import { Diamond } from "./layers/Diamond";
import { Line } from "./layers/Line";

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

      case LayerType.Path:
        return (
          <Path
            onPointerDown={onPointerDown}
            layer={layer}
            layerId={layerId}
            isDrawing={canvasMode === CanvasMode.Pencil}
          />
        );

      case LayerType.Ellipse:
        return (
          <Ellipse
            onPointerDown={onPointerDown}
            layer={layer}
            layerId={layerId}
          />
        );

      case LayerType.Diamond:
        return (
          <Diamond
            onPointerDown={onPointerDown}
            layer={layer}
            layerId={layerId}
          />
        );

      case LayerType.Text:
        return (
          <Text onPointerDown={onPointerDown} layer={layer} layerId={layerId} />
        );

      case LayerType.Line:
        return (
          <Line onPointerDown={onPointerDown} layer={layer} layerId={layerId} />
        );
    }
  }
);

LayerPreview.displayName = "LayerPreview";
