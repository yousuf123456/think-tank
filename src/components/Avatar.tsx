import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  alt: string;
  image: string;
  className?: string;
  onMouseMove?: (event: any) => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  image,
  alt,
  onMouseMove,
  className,
}) => {
  return (
    <Image
      height={100}
      width={100}
      src={image}
      alt={alt}
      onMouseMove={onMouseMove}
      className={cn(
        "object-cover !m-0 !p-0 object-top rounded-full h-full w-full border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500",
        className
      )}
    />
  );
};
