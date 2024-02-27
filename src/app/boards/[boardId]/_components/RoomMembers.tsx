import React from "react";
import { useOthers, useSelf } from "../../../../../liveblocks.config";
import { AnimatedAvatarsTooltip } from "@/components/ui/animated-avatars-tooltip";

const MAX_ITEMS = 3;

export const RoomMembers = () => {
  const others = useOthers();
  const me = useSelf();

  const users = [
    {
      name: "You",
      image: me?.info?.image!,
    },
    ...others.map((other) => ({
      name: other.info?.name!,
      image: other.info?.image!,
    })),
  ];

  let numOfExceedingItems = users.length - MAX_ITEMS;
  if (numOfExceedingItems < 0) {
    numOfExceedingItems = 0;
  }

  return (
    <div className="flex items-center justify-center">
      <AnimatedAvatarsTooltip
        items={users.slice(0, MAX_ITEMS)}
        numOfExceedingItems={numOfExceedingItems}
      />
    </div>
  );
};
