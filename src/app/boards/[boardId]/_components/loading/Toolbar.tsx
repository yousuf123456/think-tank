import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const Toolbar = () => {
  return (
    <Skeleton className="w-12 fixed top-[calc(50%+32px)] -translate-y-1/2 left-6 rouned-md h-96 bg-slate-100" />
  );
};
