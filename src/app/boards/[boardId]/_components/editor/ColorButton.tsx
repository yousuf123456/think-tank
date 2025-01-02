import React from "react";
import { Color } from "@/app/types";
import clsx from "clsx";
import { cn, rgbToHex } from "@/lib/utils";

export const ColorButton = ({
  color,
  onClick,
  isActive,
  transparent,
}: {
  color?: Color;
  isActive: boolean;
  onClick: () => void;
  transparent?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: color && rgbToHex(color) }}
      className={cn(
        "rounded-md w-6 h-6 cursor-pointer",
        transparent && "bg-transparent border border-zinc-300",
        isActive && " ring-1 ring-offset-2 ring-zinc-400"
      )}
    />
  );
};
