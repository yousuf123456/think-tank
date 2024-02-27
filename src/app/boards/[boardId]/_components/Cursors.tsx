import React, { memo, useEffect } from "react";
import { useOthers } from "../../../../../liveblocks.config";
import { Cursor } from "./Cursor";

interface CursorsProps {}

export const Cursors = memo(({}: CursorsProps) => {
  const others = useOthers();

  const othersWithCursor = others.filter((other) => other.presence.cursor);

  return (
    <>
      {othersWithCursor.map((other, i) => (
        <Cursor
          key={i}
          name={other.info?.name!}
          x={other.presence.cursor!.x}
          y={other.presence.cursor!.y}
          connectionId={other.connectionId}
        />
      ))}
    </>
  );
});

Cursors.displayName = "Cursors";
