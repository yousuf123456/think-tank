import { cn } from "@/lib/utils";
import React from "react";

export const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-5xl mx-auto px-4 sm:px-12 md:px-20 lg:px-12",
        className
      )}
    >
      {children}
    </div>
  );
};
