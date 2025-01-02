"use client";

import React from "react";
import {
  useMutation,
  useSelf,
  useStorage,
} from "../../../../../../liveblocks.config";
import { ColorButton } from "./ColorButton";
import { Color, LayerType } from "@/app/types";
import { StrokeWidthSlider } from "./StrokeWidthSlider";
import { OpacitySlider } from "./OpacitySlider";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash, Trash2 } from "lucide-react";

export const LayerEditor = ({
  onDelete,
  sendToBack,
  onBgChange,
  bringToFront,
  onStrokeChange,
}: {
  onDelete: () => void;
  sendToBack: () => void;
  bringToFront: () => void;
  onStrokeChange: (stroke: Color) => void;
  onBgChange: (bg: Color | string) => void;
}) => {
  const editLayer = useMutation(
    ({ storage, self }, propertyChange: { [key: string]: any }) => {
      const firstLayerId = self.presence.selection[0];
      if (!firstLayerId) return;

      storage.get("layers").get(firstLayerId)?.update(propertyChange);
    },
    []
  );

  const selectionIds = useSelf((me) => me.presence.selection);
  const layer = useStorage((root) => root.layers.get(selectionIds[0]));

  if (!layer) return;

  const isSingleLayerSelected = selectionIds.length === 1;

  //@ts-ignore Fill Property does not exist on all Layers Type
  const { fill, stroke, strokeWidth, opacity } = layer;

  const onChange = (
    propertyName: string,
    value: any,
    options?: { isChangingBg?: boolean; isChangingStroke?: boolean }
  ) => {
    if (options?.isChangingBg) onBgChange(value);
    if (options?.isChangingStroke) onStrokeChange(value);

    editLayer({ [propertyName]: value });
  };

  const rgbStrokes = [
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 165, b: 0 },
    { r: 65, g: 105, b: 225 },
    { r: 0, g: 180, b: 0 },
    { r: 220, g: 20, b: 60 },
    { r: 255, g: 215, b: 0 },
  ];

  const rgbBackgrounds = [
    "transparent",
    { r: 135, g: 206, b: 250 },
    { r: 144, g: 238, b: 144 },
    { r: 255, g: 182, b: 193 },
    { r: 255, g: 255, b: 100 },
    { r: 255, g: 204, b: 153 },
  ];

  const isText = layer.type === LayerType.Text;
  return (
    <div className="fixed right-4 top-32 drop-shadow-lg max-h-[calc(100vh-128px-32px)] h-full overflow-y-auto w-72">
      <div className="bg-white p-4">
        <div className="flex flex-col gap-6">
          {isSingleLayerSelected && !isText && (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-500 pointer-events-none">
                  Stroke
                </p>
                <div className="flex gap-3 flex-wrap">
                  {rgbStrokes.map((stroke_) => (
                    <ColorButton
                      color={stroke_}
                      isActive={
                        JSON.stringify(stroke) === JSON.stringify(stroke_)
                      }
                      onClick={() =>
                        onChange("stroke", stroke_, { isChangingStroke: true })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-500 pointer-events-none">
                  Background
                </p>
                <div className="flex gap-3 flex-wrap">
                  {rgbBackgrounds.map((bg) => {
                    return typeof bg === "string" ? (
                      <ColorButton
                        transparent
                        isActive={fill === "transparent"}
                        onClick={() =>
                          onChange("fill", bg, { isChangingBg: true })
                        }
                      />
                    ) : (
                      <ColorButton
                        color={bg}
                        isActive={JSON.stringify(bg) === JSON.stringify(fill)}
                        onClick={() =>
                          onChange("fill", bg, { isChangingBg: true })
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-500 pointer-events-none">
                  Stroke Width
                </p>
                <div className="flex gap-4 flex-wrap">
                  <StrokeWidthSlider
                    onChange={onChange}
                    value={[strokeWidth]}
                  />
                </div>
              </div>
            </>
          )}
          {isSingleLayerSelected && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-zinc-500 pointer-events-none">
                Opacity
              </p>
              <div className="flex gap-4 flex-wrap">
                <OpacitySlider onChange={onChange} value={[opacity]} />
              </div>
            </div>
          )}
          {isText && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-zinc-500 pointer-events-none">
                Text Color
              </p>
              <div className="flex gap-3 flex-wrap">
                {rgbStrokes.map((stroke_) => (
                  <ColorButton
                    color={stroke_}
                    isActive={JSON.stringify(fill) === JSON.stringify(stroke_)}
                    onClick={() =>
                      onChange("fill", stroke_, { isChangingStroke: true })
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-500 pointer-events-none">Actions</p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={bringToFront}
                className="p-2.5 h-fit w-fit"
              >
                <BringToFront className="w-4 h-4 text-zinc-700" />
              </Button>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={sendToBack}
                className="p-2.5 h-fit w-fit"
              >
                <SendToBack className="w-4 h-4 text-zinc-700" />
              </Button>
              {
                <Button
                  size={"sm"}
                  onClick={onDelete}
                  variant={"secondary"}
                  className="p-2.5 h-fit w-fit"
                >
                  <Trash2 className="w-4 h-4 text-zinc-700" />
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
