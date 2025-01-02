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
  LineLayer,
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
  useSelf,
  useStorage,
} from "../../../../../liveblocks.config";

import { Cursors } from "./Cursors";
import {
  cn,
  connectionIdToColor,
  getIntersectingLayerIds,
  getResizeCursor,
  penPointsToPathLayer,
  pointerEventToCursorCoords,
  resizeBounds,
  rgbToHex,
  translatePoints,
} from "@/lib/utils";
import useDeleteLayers from "@/hooks/useDeleteLayers";

import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./Layer";
import { SelectionBox } from "./SelectionBox";
import { SelectionNet } from "./SelectionNet";
import { Path } from "./layers/Path";
import { LayerEditor } from "./editor/LayerEditor";

const MAX_LAYERS = 500;

export const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useStorage((root) => root.layerIds);

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const pencilColor = useSelf((me) => me.presence.penColor);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [showSelectionBox, setShowSelectionBox] = useState(false);

  const [camera, setCamera] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [lastUsedBg, setLastUsedBg] = useState<Color | string>("transparent");

  const [lastUsedStroke, setLastUsedStroke] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const deleteLayers = useDeleteLayers();

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete": {
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
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Diamond,
      point: Point
    ) => {
      const layers = storage.get("layers");
      const layerIds = storage.get("layerIds");

      // Checking if it exceeds the max layers limit
      if (layerIds.length >= MAX_LAYERS) return;

      const newLayerId = nanoid();
      const isText = layerType === LayerType.Text;

      const newLayer: LiveObject<Layer> = new LiveObject({
        x: point.x,
        y: point.y,
        opacity: 1,
        strokeWidth: 2,
        type: layerType,
        stroke: lastUsedStroke,
        width: isText ? 35 : 0,
        height: isText ? 35 : 0,
        fill: isText ? { r: 0, g: 0, b: 0 } : lastUsedBg,
      });

      layerIds.push(newLayerId);
      layers.set(newLayerId, newLayer);

      // if (!isText)
      setMyPresence({ selection: [newLayerId] }, { addToHistory: true });

      // if (!isText)
      onResize(Side.Bottom + Side.Right, {
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
      });
    },
    [lastUsedBg, lastUsedStroke]
  );

  const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft, penColor } = self.presence;

    if (
      pencilDraft == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(
        penPointsToPathLayer(pencilDraft, penColor || lastUsedStroke)
      )
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);
    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, []);

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
    ({ storage, self }, points: Point, shiftKeyPressed: boolean) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const firstLayer = storage.get("layers").get(self.presence.selection[0]);

      if (!firstLayer) return;

      const resizedBounds = resizeBounds(
        canvasState.corner,
        canvasState.initialBounds,
        points,
        shiftKeyPressed
      );

      firstLayer.update(resizedBounds);
    },
    [canvasState]
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, current: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const layers = storage.get("layers");
      const selection = self.presence.selection;

      selection.map((layerId) => {
        const layer = layers.get(layerId);
        if (!layer) return;

        const translatedPoints: Point | { start: Point; end: Point } =
          translatePoints(current, canvasState.current, layer.toObject());

        layer.update(translatedPoints);
      });
      setCanvasState({ mode: CanvasMode.Translating, current });
    },
    [canvasState]
  );

  const translatePoint = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.TranslatingPoint) return;

      const firstLayerId = self.presence.selection[0];
      if (!firstLayerId) return;

      const layers = storage.get("layers");
      const selectedLayer = layers.get(firstLayerId);

      if (selectedLayer === undefined) return;

      if (canvasState.start) {
        selectedLayer.update({
          start: point,
        });
      } else {
        selectedLayer.update({
          end: point,
        });
      }
    },
    [canvasState.mode]
  );

  const startMultiSelection = useMutation(
    ({}, current: Point) => {
      if (!(canvasState.mode === CanvasMode.Pressing)) return;

      const { origin } = canvasState;

      if (
        Math.abs(current.x - origin.x) > 5 &&
        Math.abs(current.y - origin.y) > 5
      ) {
        setShowSelectionBox(true);
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

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      if (canvasState.mode !== CanvasMode.Pencil) return;

      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedStroke,
      });
    },
    [canvasState.mode]
  );

  const startDrawingArrow = useMutation(
    ({ storage, setMyPresence }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Arrow) return;

      const layerIds = storage.get("layerIds");
      const layers = storage.get("layers");

      const layerId = nanoid();
      const layer: LiveObject<LineLayer> = new LiveObject({
        type: LayerType.Line,
        start: point,
        end: point,
        strokeWidth: 1,
        stroke: lastUsedStroke,
        opacity: 1,
      });

      layerIds.push(layerId);
      layers.set(layerId, layer);

      setCanvasState({
        mode: CanvasMode.TranslatingPoint,
        end: true,
      });

      setMyPresence({ selection: [layerId] });
    },
    [canvasState.mode]
  );

  const keepDrawing = useMutation(
    ({ setMyPresence, self }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        pencilDraft === null ||
        e.buttons !== 1 ||
        canvasState.mode !== CanvasMode.Pencil
      )
        return;

      setMyPresence({
        pencilDraft:
          pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode, pencilDraft]
  );

  const deleteLayer = useMutation(({ storage, setMyPresence, self }) => {
    const selection = self.presence.selection;

    const layers = storage.get("layers");

    selection.map((layerId) => {
      layers.delete(layerId);
    });

    setMyPresence({ selection: [] });
  }, []);

  const bringToFront = useMutation(({ storage, self }) => {
    const selection = self.presence.selection;

    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];

    const arr = liveLayerIds.toArray();

    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) {
        indices.push(i);
      }
    }

    for (let i = indices.length - 1; i >= 0; i--) {
      liveLayerIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
    }
  }, []);

  const sendToBack = useMutation(({ storage, self }) => {
    const selection = self.presence.selection;
    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];

    const arr = liveLayerIds.toArray();

    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) {
        indices.push(i);
      }
    }

    for (let i = 0; i < indices.length; i++) {
      liveLayerIds.move(indices[i], i);
    }
  }, []);

  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  };

  const onPointerMove = useMutation(
    ({}, e: React.PointerEvent) => {
      const points = pointerEventToCursorCoords(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(points);
      }

      if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(points);
      }

      if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(points, e.shiftKey);
      }

      if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(points);
      }

      if (canvasState.mode === CanvasMode.TranslatingPoint) {
        translatePoint(points);
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        keepDrawing(points, e);
      }

      updateCursorPosition(points);
    },
    [
      canvasState.mode,
      camera,
      startMultiSelection,
      updateSelectionNet,
      resizeSelectedLayer,
      translateSelectedLayer,
      keepDrawing,
      updateCursorPosition,
    ]
  );

  const onMouseLeave = () => {
    removeCursor();
  };

  const onPointerUp = useMutation(
    ({}) => {
      if (canvasState.mode === CanvasMode.Resizing && !showSelectionBox) {
        setShowSelectionBox(true);
        selectLayer(layerIds[layerIds.length - 1], { x: 0, y: 0 });
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
        return;
      }

      setCanvasState({
        mode: CanvasMode.None,
      });

      history.resume();
    },
    [
      canvasState.mode,
      setCanvasState,
      setShowSelectionBox,
      selectLayer,
      showSelectionBox,
    ]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    const point: Point = pointerEventToCursorCoords(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
      return;
    }

    if (canvasState.mode === CanvasMode.Arrow) {
      startDrawingArrow(point);
      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure);
      return;
    }

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

  const onSelectionBoxPointerDown = (e: React.PointerEvent) => {
    if (
      canvasState.mode === CanvasMode.Inserting ||
      canvasState.mode === CanvasMode.Pencil
    )
      return;

    setCanvasState({
      mode: CanvasMode.Translating,
      current: pointerEventToCursorCoords(e, camera),
    });
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

  const onStrokeChange = (stroke: Color) => {
    setLastUsedStroke(stroke);
  };
  const onBgChange = (bg: Color | string) => {
    setLastUsedBg(bg);
  };

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

      {showSelectionBox && (
        <LayerEditor
          onDelete={deleteLayer}
          onBgChange={onBgChange}
          sendToBack={sendToBack}
          bringToFront={bringToFront}
          onStrokeChange={onStrokeChange}
        />
      )}

      <svg
        onWheel={onWheel}
        onPointerUp={onPointerUp}
        onMouseLeave={onMouseLeave}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        className={cn(
          "w-[100vw] h-[100vh] bg-white bg-grid-small-black/[0.2]",
          (canvasState.mode === CanvasMode.Inserting ||
            (canvasState.mode === CanvasMode.Resizing && !showSelectionBox)) &&
            "cursor-crosshair",
          canvasState.mode === CanvasMode.Pencil && "cursor-default"
        )}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {pencilDraft !== null && pencilColor !== null && (
            <Path
              isDrawing={canvasState.mode === CanvasMode.Pencil}
              fill={rgbToHex(pencilColor)}
              points={pencilDraft}
              isDraft
              x={0}
              y={0}
            />
          )}

          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              layerId={layerId}
              canvasMode={canvasState.mode}
              onPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}

          {showSelectionBox && (
            <SelectionBox
              onResizePointerDown={onResize}
              onPointerDown={onSelectionBoxPointerDown}
              isResizing={canvasState.mode === CanvasMode.Resizing}
            />
          )}

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
