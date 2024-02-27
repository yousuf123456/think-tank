import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { json } from "stream/consumers";
import Image from "next/image";
import { Loader2, MoreVertical, Star } from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Actions } from "./Actions";
import { cn } from "@/lib/utils";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  title: string;
  image: string;
  isFav: boolean;
  orgId: string;
  authorName: string;
  createdAt: number;
}

export const Board = ({
  title,
  authorName,
  createdAt,
  image,
  isFav,
  orgId,
  id,
}: Props) => {
  const { mutate: favourite, isLoading: isFavouriting } = useApiMutation(
    api.board.favouriteBoard
  );
  const { mutate: unfavourite, isLoading: isUnfavouriting } = useApiMutation(
    api.board.unfavouriteBoard
  );

  const distance = formatDistanceToNow(createdAt, { addSuffix: true });

  const { user } = useUser();

  const author = user?.fullName === authorName ? "You" : authorName;

  const { toast } = useToast();

  const toggleFav = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFavouriting || isUnfavouriting) return;

    if (isFav) {
      unfavourite({
        boardId: id,
      }).catch(() => {
        toast({
          title: "Failed to unfavourite board",
          description: "Please refresh and try again later.",
          variant: "destructive",
        });
      });
    } else {
      favourite({
        boardId: id,
        orgId: orgId,
      }).catch(() =>
        toast({
          title: "Failed to favourite board",
          description: "Please refresh and try again later.",
          variant: "destructive",
        })
      );
    }
  };

  return (
    // <Link href={`boards/${id}`}>
    <div className="w-full rounded-b-md flex flex-col gap-0 shadow-sm group border border-zinc-100">
      <div className="relative w-full h-auto aspect-square bg-white overflow-hidden">
        <Image src={image} alt="Board Image" className="w-full h-full" fill />

        <div className="opacity-0 absolute inset-0 bg-black group-hover:opacity-50 transition">
          <div className="z-50 absolute top-2 right-2">
            <Actions boardId={id}>
              <button className="h-fit p-1 hover:bg-zinc-800 focus-visible:outline-none rounded-md transition">
                <MoreVertical className="text-white w-5 h-5 " />
              </button>
            </Actions>
          </div>
        </div>
      </div>

      <Link href={`boards/${id}`}>
        <div className="px-2 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium flex-1 truncate text-zinc-600">
              {title}
            </p>

            <Button
              onClick={toggleFav}
              disabled={isFavouriting || isUnfavouriting}
              className="h-fit p-1 bg-transparent group hover:bg-transparent"
            >
              {isFavouriting || isUnfavouriting ? (
                <Loader2 className="text-zinc-500 w-4 h-4 animate-spin" />
              ) : (
                <Star
                  className={cn(
                    "w-[17px] h-[17px] stroke-[2px] text-zinc-500 hover:fill-amber-400 hover:text-amber-400",
                    isFav && "fill-amber-400 text-amber-400",
                    isFavouriting || (isUnfavouriting && "opacity-50")
                  )}
                />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm truncate text-zinc-400">{author}</p>

            <p className="text-xs truncate text-zinc-400 flex-shrink-0">
              {distance}
            </p>
          </div>
        </div>
      </Link>
    </div>
    // </Link>
  );
};
