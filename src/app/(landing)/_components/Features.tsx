import React from "react";
import { FaCircle, FaSquare } from "react-icons/fa";
import { BsDiamondFill } from "react-icons/bs";

export const Features = () => {
  return (
    <div className="flex flex-col gap-16 mx-auto w-full max-w-6xl">
      <div className="relative flex">
        <FaCircle className="lg:w-64 lg:h-64 md:w-48 md:h-48 w-32 h-32 sm:w-40 sm:h-40 fill-sky-300 flex-shrink-0" />

        <div className="flex flex-col gap-2 lg:gap-4 -translate-x-16 pl-5 bg-white justify-center">
          <h4 className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-semibold">
            Real-Time Collaboration
          </h4>

          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            Collaborate in real-time with your team. Share ideas, make updates,
            and stay synced no matter the distance.
          </p>
        </div>
      </div>

      <div className="relative flex">
        <div className="flex flex-col gap-2 lg:gap-4 translate-x-10 pr-5 bg-white justify-center items-end">
          <h4 className="text-xl sm:text-2xl lg:text-3xl text-end text-gray-800 font-semibold">
            Intuitive Visual Tools
          </h4>

          <p className="text-sm sm:text-base lg:text-lg text-gray-500 text-right">
            From drawing concepts to organizing thoughts, our tools are built to
            make collaboration effortless.
          </p>
        </div>

        <FaSquare className="lg:w-64 lg:h-64 md:w-48 md:h-48 w-32 h-32 sm:w-40 sm:h-40 fill-green-300 flex-shrink-0" />
      </div>

      <div className="relative flex">
        <BsDiamondFill className="lg:w-64 lg:h-64 md:w-48 md:h-48 w-32 h-32 sm:w-40 sm:h-40 fill-purple-300 flex-shrink-0" />

        <div className="flex flex-col gap-2 lg:gap-4 -translate-x-12 pl-5 bg-white justify-center">
          <h4 className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-semibold">
            Organized and Secure Workspace
          </h4>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500">
            Keep all your projects in one secure and organized workspace. Easily
            find past boards, manage team access.
          </p>
        </div>
      </div>
    </div>
  );
};
