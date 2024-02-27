"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Toolbar } from "./Toolbar";
import { Navbar } from "./Navbar";
import { Id } from "../../../../../convex/_generated/dataModel";

import {
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/app/types";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "../../../../../liveblocks.config";
import { Cursors } from "./Cursors";
import {
  cn,
  connectionIdToColor,
  getIntersectingLayerIds,
  getResizeCursor,
  pointerEventToCursorCoords,
  resizeBounds,
  translatePoints,
} from "@/lib/utils";
import useDeleteLayers from "@/hooks/useDeleteLayers";

import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./Layer";
import { SelectionBox } from "./SelectionBox";
import { SelectionNet } from "./SelectionNet";

const MAX_LAYERS = 500;

export const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [showSelectionBox, setShowSelectionBox] = useState(false);

  const [camera, setCamera] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 249,
    g: 115,
    b: 22,
  });

  const deleteLayers = useDeleteLayers();

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Backspace": {
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  const insertLayer = useMutation(
    (
      { setMyPresence, storage },
      layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text,
      point: Point
    ) => {
      const layers = storage.get("layers");
      const layerIds = storage.get("layerIds");

      if (layerIds.length >= MAX_LAYERS) return;

      const newLayerId = nanoid();
      const newLayer: LiveObject<Layer> = new LiveObject({
        type: layerType,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: lastUsedColor,
      });

      layerIds.push(newLayerId);
      layers.set(newLayerId, newLayer);

      setMyPresence({ selection: [newLayerId] }, { addToHistory: true });
      onResize(Side.Bottom + Side.Right, {
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
      });
    },
    [lastUsedColor]
  );

  const updateCursorPosition = useMutation(
    ({ setMyPresence }, coords: { x: number; y: number }) => {
      setMyPresence({
        cursor: coords,
      });
    },
    []
  );

  const removeCursor = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const selectLayer = useMutation(
    ({ self, setMyPresence }, layerId, point: Point) => {
      history.pause();

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] });
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [history, setCanvasState]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, points: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const resizedBounds = resizeBounds(
        canvasState.corner,
        canvasState.initialBounds,
        points
      );

      const firstLayer = storage.get("layers").get(self.presence.selection[0]);

      if (!firstLayer) return;

      firstLayer.update(resizedBounds);
    },
    [canvasState]
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, current: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const layer = storage.get("layers").get(self.presence.selection[0]);
      if (!layer) return;

      const translatedPoints: Point = translatePoints(
        current,
        canvasState.current,
        layer.toObject()
      );

      layer.update(translatedPoints);
      setCanvasState({ mode: CanvasMode.Translating, current });
    },
    [canvasState]
  );

  const startMultiSelection = useMutation(
    ({}, current: Point) => {
      if (!(canvasState.mode === CanvasMode.Pressing)) return;

      console.log("Starting multi selection");
      const { origin } = canvasState;

      if (
        Math.abs(current.x - origin.x) > 5 &&
        Math.abs(current.y - origin.y) > 5
      ) {
        setCanvasState({
          mode: CanvasMode.SelectionNet,
          origin: origin,
          current: current,
        });
      }
    },
    [canvasState]
  );

  const updateSelectionNet = useMutation(
    ({ setMyPresence, storage }, current: Point) => {
      if (!(canvasState.mode === CanvasMode.SelectionNet)) return;

      const layers = storage.get("layers").toImmutable();
      const layerIds = storage.get("layerIds").toImmutable();

      const intersectingLayerIds: string[] = getIntersectingLayerIds(
        layerIds,
        layers,
        canvasState.origin,
        current
      );

      setMyPresence({ selection: intersectingLayerIds });

      setCanvasState((prev) => ({ ...prev, current }));
    },
    [canvasState]
  );

  const clearSelection = useMutation(({ setMyPresence }) => {
    setMyPresence({ selection: [] });
  }, []);

  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  };

  const onPointerMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const points = pointerEventToCursorCoords(e, camera);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(points);
    }

    if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(points);
    }

    if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(points);
    }

    if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayer(points);
    }

    updateCursorPosition(points);
  };

  const onMouseLeave = () => {
    removeCursor();
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (canvasState.mode === CanvasMode.Resizing && !showSelectionBox) {
      setShowSelectionBox(true);
      selectLayer(layerIds[layerIds.length - 1], { x: 0, y: 0 });
    }

    setCanvasState({
      mode: CanvasMode.None,
    });
  };

  const onPointerDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (canvasState.mode === CanvasMode.Inserting) {
      const point: Point = pointerEventToCursorCoords(e, camera);
      insertLayer(canvasState.layerType, point);

      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) return;

    const origin = pointerEventToCursorCoords(e, camera);

    setCanvasState({
      mode: CanvasMode.Pressing,
      origin,
    });

    setShowSelectionBox(false);
    clearSelection();
  };

  const onToolbuttonClick = () => {
    setShowSelectionBox(false);
    clearSelection();
  };

  const onLayerPointerDown = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    layerId: string
  ) => {
    if (
      canvasState.mode === CanvasMode.Inserting ||
      canvasState.mode === CanvasMode.Pencil
    )
      return;

    setShowSelectionBox(true);
    e.stopPropagation();

    const point: Point = pointerEventToCursorCoords(e, camera);
    selectLayer(layerId, point);
  };

  const onResize = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();

      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history, setCanvasState]
  );

  const usersSelection = useOthersMapped((others) => others.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layersColors: { [key: string]: string } = {};

    usersSelection.map((userSelection) => {
      const [connectionId, selections] = userSelection;

      selections.map((layerId) => {
        layersColors[layerId] = connectionIdToColor(connectionId);
      });
    });

    return layersColors;
  }, [usersSelection]);

  return (
    <div className="relative bg-transparent w-full h-full">
      <Navbar boardId={boardId as Id<"board">} />
      <Toolbar
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
        canvasState={canvasState}
        onClick={onToolbuttonClick}
        setCanvasState={setCanvasState}
      />

      <svg
        onWheel={onWheel}
        onPointerUp={onPointerUp}
        onMouseLeave={onMouseLeave}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        className={cn(
          "w-[100vw] h-[100vh] bg-grid",
          canvasState.mode === CanvasMode.Resizing &&
            getResizeCursor(canvasState.corner),
          (canvasState.mode === CanvasMode.Inserting ||
            (canvasState.mode === CanvasMode.Resizing && !showSelectionBox)) &&
            "cursor-crosshair"
        )}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {showSelectionBox && <SelectionBox onResizePointerDown={onResize} />}

          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              layerId={layerId}
              canvasMode={canvasState.mode}
              onPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current && (
              <SelectionNet
                origin={canvasState.origin}
                current={canvasState.current}
              />
            )}

          <Cursors />
        </g>
      </svg>
    </div>
  );
};
