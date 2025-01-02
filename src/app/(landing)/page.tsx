import React from "react";
import { Hero } from "./_components/Hero";
import { Features } from "./_components/Features";
import { CTA } from "./_components/CTA";

export default function Page() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-24 px-3 md:px-7">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}
