import { Loader2 } from "lucide-react";
import React from "react";
import { Toolbar } from "./Toolbar";
import { Header } from "./Header";

export const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Toolbar />
      <Header />

      <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
    </div>
  );
};
