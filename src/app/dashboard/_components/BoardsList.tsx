import React, { useEffect } from "react";
import { EmptyBoards } from "./_emptyStates/EmptyBoards";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { EmptyFav } from "./_emptyStates/EmptyFav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateBoardModal } from "./CreateBoardModal";
import { Board } from "./Board";
import { NothingFound } from "./_emptyStates/NothingFound";
import Link from "next/link";

interface BoardsListProps {
  orgId: string;
  query: {
    q: string | null;
    fav: boolean;
  };
}

export const BoardsList = ({ orgId, query }: BoardsListProps) => {
  const boards = useQuery(api.boards.getBoards, { orgId, query });

  if (boards === undefined) {
    return (
      <div className="mx-auto flex flex-col gap-6 py-3 px-6 lg:py-6 lg:px-12 max-sm:mt-8 max-w-7xl w-full">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <h2 className="text-2xl font-semibold text-zinc-700">
            {query.fav ? "Favourite Boards" : "Your Boards"}
          </h2>

          <Button size={"lg"} disabled>
            Create New Board
          </Button>
        </div>

        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
          <Skeleton className="w-full h-auto aspect-[12/13]" />
          <Skeleton className="w-full h-auto aspect-[12/13]" />
          <Skeleton className="w-full h-auto aspect-[12/13]" />
          <Skeleton className="w-full h-auto aspect-[12/13]" />
        </div>
      </div>
    );
  }

  if (query.q && boards?.length === 0) {
    return <NothingFound q={query.q} />;
  }

  if (query.fav && boards?.length === 0) {
    return <EmptyFav />;
  }

  if (boards?.length === 0) return <EmptyBoards orgId={orgId} />;

  return (
    <div className="mx-auto flex flex-col gap-6 py-3 px-6 lg:py-6 lg:px-12 max-sm:mt-8 max-w-7xl w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">
        <h2 className="text-2xl font-semibold text-zinc-700">
          {query.fav ? "Favourite Boards" : "Your Boards"}
        </h2>

        <div className="flex gap-3">
          <CreateBoardModal orgId={orgId}>
            <Button>Create New Board</Button>
          </CreateBoardModal>

          {query.fav ? (
            <Link
              href={"/dashboard"}
              className={buttonVariants({ variant: "secondary" })}
            >
              All
            </Link>
          ) : (
            <Link
              href={"/dashboard?fav=true"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Favorites
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
        {boards.map((board, i) => (
          <Board
            id={board._id}
            key={board._id}
            orgId={board.orgId}
            title={board.title}
            image={board.imageUrl}
            isFav={!!board.isFavorite}
            authorName={board.authorName}
            createdAt={board._creationTime}
          />
        ))}
      </div>
    </div>
  );
};
