import React from "react";
import Image from 'next/image'

export const EmptyFav = () => {
  return (
    <div className="h-full flex flex-col gap-8 items-center justify-center">
      <Image
        src={"/not-found.svg"}
        alt="Not Found Illustration"
        width={200}
        height={200}
      />

      <h1 className="text-xl sm:text-2xl font-semibold">
        No boards in favourites yet!
      </h1>
    </div>
  );
};