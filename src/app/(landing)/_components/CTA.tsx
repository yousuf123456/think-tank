import { SignedOut, SignUpButton } from "@clerk/nextjs";
import { PencilLine } from "lucide-react";
import { FaCircle, FaSquare } from "react-icons/fa";
import React from "react";
import { BsDiamondFill } from "react-icons/bs";

export const CTA = () => {
  return (
    <div className="mt-20 max-w-6xl w-full mx-auto flex lg:flex-row flex-col items-center gap-10 lg:gap-6">
      <div className="md:h-72 h-64 w-full border border-pink-200 relative grid grid-cols-2 grid-rows-2">
        <div className="w-2 h-2 rounded-full animate-pulse bg-pink-400 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-2 h-2 rounded-full animate-pulse bg-pink-400 absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
        <div className="w-2 h-2 rounded-full animate-pulse bg-pink-400 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <div className="w-2 h-2 rounded-full animate-pulse bg-pink-400 absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

        <div>
          <BsDiamondFill className="animate-float delay-500 fill-yellow-300 w-[65%] h-[65%] relative left-6 top-8" />
        </div>

        <PencilLine
          strokeWidth={1}
          className="animate-float w-[40%] h-[40%] text-purple-400 relative left-[30%] top-12"
        />

        <FaSquare className="animate-float relative w-[60%] h-[60%] delay-300 left-[15%] top-6 fill-pink-400" />

        <FaCircle className="animate-float delay-300 w-[60%] h-[60%] left-[25%] top-8 relative fill-green-400" />
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        <h2 className="text-center text-5xl sm:text-6xl font-medium tracking-tighter text-gray-800">
          Start Collaborating <br /> Today
        </h2>

        <SignedOut>
          <div className="flex mx-auto gap-8">
            <SignUpButton redirectUrl="/dashboard">
              <button className="w-64 py-3 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
                <div className="absolute -bottom-2 -right-2 bg-pink-300/70 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />

                <span className="relative text-xl">Create an Account</span>
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};
