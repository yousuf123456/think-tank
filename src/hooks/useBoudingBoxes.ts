import { Layer, XYWH } from "@/app/types";
import { useSelf, useStorage } from "../../liveblocks.config";
import { shallow } from "@liveblocks/client";

const getBoundingBoxes = (selectedLayers: Layer[]): XYWH | null => {
  const firstLayer = selectedLayers[0];

  if (!firstLayer) return null;

  const { x, y, width, height } = firstLayer;

  let top = y;
  let left = x;
  let right = x + width;
  let bottom = y + height;

  selectedLayers.forEach((layer, i) => {
    // ignore first layer
    if (i === 0) return;

    const { x, y, width, height } = layer;

    if (x < left) {
      left = x;
    }

    if (y < top) {
      top = y;
    }

    if (x + width > right) {
      right = x + width;
    }

    if (y + height > bottom) {
      bottom = y + height;
    }
  });

  const boundingBoxes: XYWH = {
    x: left - 6,
    y: top - 6,
    width: Math.abs(right - left) + 12,
    height: Math.abs(bottom - top) + 12,
  };

  return boundingBoxes;
};

export const useBoundingBoxes = () => {
  const selections = useSelf((self) => self.presence.selection);

  return useStorage((storage) => {
    const selectedLayers = selections
      .map((layerId) => storage.layers.get(layerId)!)
      .filter(Boolean);

    return getBoundingBoxes(selectedLayers);
  }, shallow);
};
