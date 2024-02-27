import React from "react";
import { Canvas } from "./_components/Canvas";
import { Rooms } from "@/components/rooms";

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const boardId = params.boardId;

  return (
    <Rooms roomId={boardId}>
      <Canvas boardId={boardId} />
    </Rooms>
  );
}
