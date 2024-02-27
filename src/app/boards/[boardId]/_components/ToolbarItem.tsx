import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface ToolbarProps {
  tooltip: string;
  Icon: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

export const ToolbarItem = ({
  Icon,
  onClick,
  tooltip,
  isActive,
  isDisabled,
}: ToolbarProps) => {
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "h-fit p-2 hover:bg-orange-100",
        isActive && "bg-orange-100"
      )}
    >
      <Icon
        className={cn(
          "w-[17px] h-[17px] text-zinc-800",
          isActive && "text-orange-500"
        )}
      />
    </Button>
  );
};
