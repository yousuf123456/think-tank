import { Loader2 } from "lucide-react";
import React from "react";

export const Loading = () => {
  return (
    <div className="pt-32 flex flex-col items-center justify-center">
      <Loader2 className="w-9 h-9 text-primary animate-spin" />

      <h1 className="text-xl font-semibold mt-4">Preparing your boards</h1>
    </div>
  );
};
