import { CanvasMode, CanvasState, LayerType } from "@/app/types";
import {
  ArrowBigLeft,
  Circle,
  Diamond,
  Minus,
  MousePointer2,
  Notebook,
  Pen,
  Redo,
  Square,
  Text,
  Undo,
} from "lucide-react";
import React from "react";
import { ToolbarItem } from "./ToolbarItem";

interface ToolbarProps {
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
  canvasState: CanvasState;
  onClick: () => void;
  canRedo: boolean;
  canUndo: boolean;
  redo: () => void;
  undo: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  setCanvasState,
  canvasState,
  canRedo,
  onClick,
  canUndo,
  redo,
  undo,
}) => {
  return (
    <div className="fixed left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-4 lg:top-1/2 lg:-translate-y-1/2 lg:left-4 px-3 sm:px-6 py-3 lg:px-3 lg:py-6 bg-white drop-shadow-md rounded-md">
      <div className="flex flex-row lg:flex-col gap-2">
        <ToolbarItem
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Translating
          }
          tooltip="Select"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.None,
            });
          }}
          Icon={MousePointer2}
        />

        <ToolbarItem
          Icon={Text}
          tooltip="Text"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            });
          }}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />

        <ToolbarItem
          Icon={Pen}
          tooltip="Pencil"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Pencil,
            });
          }}
          isActive={canvasState.mode === CanvasMode.Pencil}
        />

        <ToolbarItem
          Icon={Square}
          tooltip="Square"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            });
          }}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />

        <ToolbarItem
          Icon={Circle}
          tooltip="Ellipse"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            });
          }}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />

        <ToolbarItem
          Icon={Diamond}
          tooltip="Polygon"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Diamond,
            });
          }}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Diamond
          }
        />

        <ToolbarItem
          Icon={Minus}
          tooltip="Line"
          onClick={() => {
            onClick();
            setCanvasState({
              mode: CanvasMode.Arrow,
            });
          }}
          isActive={canvasState.mode === CanvasMode.Arrow}
        />

        <div className="w-[1px] lg:w-full lg:h-[1px] bg-slate-300 max-lg:mx-3 lg:my-3" />

        <ToolbarItem
          Icon={Redo}
          onClick={redo}
          tooltip="Ellipse"
          isDisabled={!canRedo}
        />

        <ToolbarItem
          Icon={Undo}
          tooltip="Ellipse"
          onClick={undo}
          isDisabled={!canUndo}
        />
      </div>
    </div>
  );
};
