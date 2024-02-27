"use client";

import React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { ArrowLeft, Edit, Menu, Pencil } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "./loading/Header";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { useActions } from "@/store/actions";
import { Actions } from "@/app/dashboard/_components/Actions";
import { RoomMembers } from "./RoomMembers";

export const Navbar = ({ boardId }: { boardId: Id<"board"> }) => {
  const board = useQuery(api.board.getBoard, { boardId });

  const { user, isLoaded } = useUser();
  const { onEditOpen } = useActions();

  if (board === undefined || !isLoaded) return <Header />;

  if (!user || !board) return null;

  const author = user.fullName === board.authorName ? "You" : board.authorName;
  const timeDistance = formatDistanceToNow(board._creationTime);

  return (
    <div className="fixed inset-x-0 left-0 px-3 sm:px-6 py-3 md:px-12 md:py-4 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl w-full flex justify-between">
        <div className="flex items-center gap-0 sm:gap-5">
          <Link
            href={"/dashboard"}
            className={buttonVariants({
              size: "sm",
              variant: "secondary",
              className: "h-fit p-0 aspect-square",
            })}
          >
            <ArrowLeft className="sm:w-5 sm:h-5 w-4 h-4" />
          </Link>

          <div className="flex flex-col gap-0 ml-5">
            <div className="flex items-center gap-3">
              <p className="text-sm sm:text-base font-medium text-zinc-800 truncate max-w-[260px]">
                {board.title}
              </p>

              <Button
                variant={"ghost"}
                className="h-fit p-1"
                onClick={() => onEditOpen(boardId)}
              >
                <Edit className="w-[14px] h-[14px] text-zinc-700" />
              </Button>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <p className="text-sm text-zinc-500">{author}</p>
              <p className="text-xs text-zinc-500">{timeDistance}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-5 items-center">
          <RoomMembers />

          <Actions boardId={boardId}>
            <Button
              variant={"ghost"}
              className="h-fit p-1.5 ml-2 md:ml-5 focus-visible:ring-0 focus-visible:outline-0 focus-within:border-none"
            >
              <Menu className="text-zinc-800 w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </Actions>
        </div>
      </div>
    </div>
  );
};
