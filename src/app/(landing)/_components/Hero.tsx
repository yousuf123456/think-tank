import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export const Hero = () => {
  return (
    <div className="min-h-screen h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.07] bg-grid-black/[0.07] relative flex justify-center items-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="mx-auto w-full max-w-3xl z-[999] flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-7">
          <h1 className="text-gray-800 text-5xl sm:text-6xl font-semibold text-center tracking-tighter">
            Everyone’s{" "}
            <span className="bg-pink-200/30 px-4 text-pink-400 relative">
              Ideas
            </span>
          </h1>

          <h1 className="text-gray-800 text-5xl text-center sm:text-6xl font-semibold tracking-tighter">
            Together in One{" "}
            <span className="bg-yellow-200/30 px-4 text-yellow-400 relative">
              Place
            </span>
          </h1>
        </div>

        <h3 className="mt-10 sm:mt-16 text-lg sm:text-xl font-normal text-gray-600 text-center max-w-2xl">
          A Collaborative Board to Share Ideas, Draw Concepts, and Bring Visions
          to Life.
        </h3>

        <SignedOut>
          <div className="flex mx-auto gap-8">
            <SignInButton redirectUrl="/dashboard">
              <button className="w-64 py-3 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
                <div className="absolute -bottom-2 -right-2 bg-pink-300/70 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />

                <span className="relative text-xl">Sign In</span>
              </button>
            </SignInButton>

            <SignUpButton redirectUrl="/dashboard">
              <button className="w-64 py-3 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
                <div className="absolute -bottom-2 -right-2 bg-yellow-300/70 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />

                <span className="relative text-xl">Get Started</span>
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Link href={"/dashboard"}>
            <button className="w-72 py-3 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
              <div className="absolute -bottom-2 -right-2 bg-pink-300/70 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />

              <span className="relative text-lg sm:text-xl">
                Go To Your Dashboard
              </span>
            </button>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
};
