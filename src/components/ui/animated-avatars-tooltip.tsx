"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

import { Avatar } from "../Avatar";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const AnimatedAvatarsTooltip = ({
  items,
  numOfExceedingItems,
}: {
  items: {
    name: string;
    image: string;
  }[];
  numOfExceedingItems: number;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move

  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;

    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className={cn("relative group -mr-4")}
          key={item.name}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="absolute -bottom-12 -right-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-3 py-1.5"
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
              >
                <div className="absolute inset-x-0 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px " />
                <div className="absolute left-0 w-[100%] z-30 -bottom-px bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px " />
                <div className="font-bold  text-white relative z-30 text-sm">
                  {item.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {
            <div className="w-8 h-8 sm:w-11 sm:h-11">
              <Avatar
                image={item.image}
                alt={item.name}
                onMouseMove={handleMouseMove}
              />
            </div>
          }
        </div>
      ))}
      {numOfExceedingItems !== 0 && (
        <div key={"exceedingItems"} className={cn("relative group -mr-4")}>
          {
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border-2 text-white border-white bg-orange-600">
              {numOfExceedingItems} <Plus className="text-white w-3 h-3" />
            </div>
          }
        </div>
      )}
    </>
  );
};
