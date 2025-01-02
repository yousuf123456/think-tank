import React from "react";
import Image from "next/image";

export const NothingFound = ({ q }: { q: string }) => {
  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <Image
        src={"/not-found.svg"}
        alt="Not Found Illustration"
        width={200}
        height={200}
      />

      <div>
        <h1 className="text-xl sm:text-2xl text-zinc-700 text-center">
          No results for <span className="font-semibold">{q}</span>
        </h1>
      </div>
    </div>
  );
};
