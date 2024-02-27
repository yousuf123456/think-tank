"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CreateBoardModal } from "../CreateBoardModal";

export const EmptyBoards = ({ orgId }: { orgId: string }) => {
  return (
    <div className="h-full flex flex-col gap-5 justify-center items-center">
      <Image
        src={"/create-board.svg"}
        alt="Create board illustration"
        width={160}
        height={160}
      />

      <h1 className="text-xl sm:text-2xl font-semibold mt-3">
        Create your first board today!
      </h1>

      <CreateBoardModal orgId={orgId}>
        <Button size={"lg"}>Create Board</Button>
      </CreateBoardModal>
    </div>
  );
};
