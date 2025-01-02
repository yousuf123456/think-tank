import { Slider } from "@/components/ui/slider";
import React from "react";

export const StrokeWidthSlider = ({
  onChange,
  value,
}: {
  onChange: (
    propertyName: string,
    value: any,
    options?: {
      isChangingBg?: boolean;
      isChangeStroke?: boolean;
    }
  ) => void;
  value: number[];
}) => {
  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1">
        <Slider
          max={6}
          step={1}
          value={value}
          onValueChange={(value) => onChange("strokeWidth", value[0])}
        />
      </div>

      <p className="w-8 text-end text-xs text-zinc-600">{value} px</p>
    </div>
  );
};
