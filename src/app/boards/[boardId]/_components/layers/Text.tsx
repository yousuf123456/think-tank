import React from "react";

import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { TextLayer } from "@/app/types";
import { cn, rgbToHex } from "@/lib/utils";
import { Roboto } from "next/font/google";
import { useMutation } from "../../../../../../liveblocks.config";

const font = Roboto({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface TextProps {
  layer: TextLayer;
  layerId: string;
  selectionColor?: string;
  onPointerDown: (e: any, layerId: string) => void;
}

export const Text: React.FC<TextProps> = ({
  layer,
  layerId,
  onPointerDown,
  selectionColor,
}) => {
  const { width, height, x, y, fill, strokeWidth, stroke, opacity } = layer;

  const onChange = useMutation(
    ({ storage }, e: ContentEditableEvent) => {
      if (!layerId) return;

      storage
        .get("layers")
        .get(layerId)
        ?.update({ value: e.target.value || " " });
    },
    [layerId]
  );

  return (
    <foreignObject
      x={0}
      y={0}
      width={width}
      height={height}
      opacity={opacity}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <ContentEditable
        onChange={onChange}
        onPointerDown={(e) => onPointerDown(e, layerId)}
        html={layer.value || "Text"}
        className={cn(
          "h-full w-full flex items-center justify-center text-center text-black outline-none cursor-move",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? rgbToHex(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
