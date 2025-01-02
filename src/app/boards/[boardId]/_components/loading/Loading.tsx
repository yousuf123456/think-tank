import React from "react";

import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Toolbar />
      <Header />

      <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
    </div>
  );
};
