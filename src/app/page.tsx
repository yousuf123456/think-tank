import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brush,
  CornerDownLeft,
  CornerDownRight,
  Lightbulb,
  Paintbrush,
  Rocket,
} from "lucide-react";
import Image from "next/image";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

const ImageComponent = ({
  image,
  alt,
  width,
  height,
  className,
}: {
  image: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-full p-1 bg-zinc-100 border border-zinc-200 rounded-lg",
        className
      )}
    >
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full rounded-lg object-cover object-center shadow-lg"
      />
    </div>
  );
};

const ColoredTextWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <>
      <span className="relative break-keep">
        {children}
        <div
          className={cn(
            "absolute inset-x-0 h-[40%] left-0 bottom-0 -z-10 ",
            className
          )}
        />
      </span>{" "}
    </>
  );
};

const Feature = ({
  headline,
  proposition,
  bgColor,
  bgColorLight,
  visual,
  className,
  reversed,
}: {
  bgColor: string;
  borderColor: string;
  visual: string;
  headline: string;
  proposition: string;
  bgColorLight: string;
  className?: string;
  reversed?: boolean;
}) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute w-32 h-32 rounded-full top-1/2 -translate-y-1/2 -z-10 blur-3xl",
          bgColorLight,
          reversed ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
        )}
      />
      <div
        className={cn(
          "flex flex-col lg:flex-row justify-between gap-10 lg:gap-24 items-center px-4 sm:px-12 mx-auto max-w-7xl",
          reversed && "lg:flex-row-reverse",
          className
        )}
      >
        <div className="flex flex-col">
          <h3
            className={cn(
              "text-2xl md:text-3xl font-semibold max-lg:text-center",
              reversed && "text-end"
            )}
          >
            <ColoredTextWrapper className={bgColor}>
              {headline}
            </ColoredTextWrapper>
          </h3>
          <p
            className={cn(
              "mt-2 text-zinc-500 text-sm max-w-md max-lg:text-center",
              reversed && "text-end"
            )}
          >
            {proposition}
          </p>
        </div>

        <div className="max-w-lg">
          <ImageComponent
            image={visual}
            alt="Visual Represting Image"
            width={1364}
            height={866}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="pt-36 flex flex-col items-center relative">
        <Brush className="absolute left-3 top-28 md:top-32 w-7 h-7 sm:w-9 sm:h-9 text-blue-200 -z-10" />

        <Rocket className="absolute left-1/3 top-20 w-7 h-7 sm:w-9 sm:h-9 text-orange-200" />

        <Lightbulb className="absolute right-1/3 top-24 w-7 h-7 sm:w-9 sm:h-9 text-yellow-200 -z-10 -rotate-45" />

        <Paintbrush className="absolute right-5 top-20 w-7 h-7 sm:w-9 sm:h-9 text-pink-200 -z-10" />

        <h1 className="max-sm:text-3xl max-lg:text-4xl text-5xl leading-[1.3] max-w-4xl font-medium text-center">
          Think Bigger, Create Together: The Infinite{" "}
          <ColoredTextWrapper className="bg-yellow-300 bottom-1">
            Canvas
          </ColoredTextWrapper>
          for{" "}
          <ColoredTextWrapper className="bg-blue-300 bottom-1">
            RealTime
          </ColoredTextWrapper>
          Collaboration
        </h1>

        <SignUpButton redirectUrl="/dashboard">
          <Button
            size={"lg"}
            className="w-fit mt-12 rounded-3xl bg-secondary-foreground/85 hover:bg-secondary-foreground/80 max-md:px-6 relative"
          >
            Get Started For Free
            <ArrowRight className="ml-3 w-4 h-4" />
            <CornerDownRight className="absolute -left-10 md:-left-16 w-7 h-7 md:w-9 md:h-9 top-1/2 -translate-y-1/2 text-zinc-300" />
            <CornerDownLeft className="absolute -right-10 md:-right-16 w-7 h-7 md:w-9 md:h-9 top-1/2 -translate-y-1/2 text-zinc-300" />
          </Button>
        </SignUpButton>
      </MaxWidthWrapper>

      <div className="mt-12 px-3">
        <div className="mx-auto max-w-4xl relative">
          <div
            aria-hidden
            className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 md:w-96 md:h-96 rounded-full bg-blue-50 blur-3xl -z-10"
          />

          <div
            aria-hidden
            className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 md:w-96 md:h-96 rounded-full bg-orange-100/70 blur-3xl -z-10"
          />

          <ImageComponent
            image="/dashboard-preview.jpg"
            alt="Visual Image"
            width={1364}
            height={866}
          />
        </div>
      </div>

      <div className="mt-40 md:mt-56">
        <div className="flex flex-col gap-16">
          <div className="px-4 sm:px-12 md:px-20 max-lg:mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-center lg:text-start max-w-2xl">
              Everything you need to collaborate effectively.
            </h2>
          </div>

          <div className="flex-1 flex flex-col gap-24">
            <Feature
              bgColor="bg-green-300"
              bgColorLight="bg-green-100"
              headline="Infinite Canvas"
              visual="/dashboard-preview.jpg"
              borderColor="border-pink-200"
              proposition="Say goodbye to cramped workspaces and explore ideas freely with a never-ending canvas for brainstorming and collaboration."
            />

            <Feature
              reversed
              bgColor="bg-blue-300"
              bgColorLight="bg-blue-100"
              headline="Face-to-face video chat"
              visual="/dashboard-preview.jpg"
              borderColor="border-blue-200"
              proposition="Put a face to the name and foster deeper connections by adding video chat to your collaborative sessions."
            />

            <Feature
              bgColor="bg-yellow-300"
              bgColorLight="bg-yellow-100"
              headline="Intuitive tools"
              visual="/dashboard-preview.jpg"
              borderColor="border-yellow-200"
              proposition=" Navigate easily with a user-friendly interface and explore a wide range of tools designed for visual thinking and communication."
            />
          </div>
        </div>
      </div>

      <div className="mt-40 lg:mt-56 pb-16 px-4 sm:px-12 md:px-20 mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Ready to collaborate ?
        </h2>

        <div className="flex justify-center gap-6 md:gap-12 mt-12 flex-col md:flex-row">
          <SignUpButton redirectUrl="/dashboard">
            <Button size={"lg"} className="rounded-3xl">
              Sign Up for free
            </Button>
          </SignUpButton>

          <SignInButton redirectUrl="/dashboard">
            <Button size={"lg"} variant={"secondary"} className="rounded-3xl">
              Login to your account
            </Button>
          </SignInButton>
        </div>
      </div>
    </>
  );
}
