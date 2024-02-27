"use client";
import React from "react";

import Link from "next/link";
import { LayoutDashboard, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export const PageLinks = () => {
  const searchParams = useSearchParams();
  const fav = searchParams.get("fav");

  return (
    <div className="flex flex-col mt-8">
      <Link
        className={buttonVariants({
          variant: fav === "true" ? "ghost" : "secondary",
        })}
        href={"/dashboard"}
      >
        <div className="max-w-[152px] w-full items-center gap-4 flex">
          <LayoutDashboard className="w-4 h-4" />
          Your Boards
        </div>
      </Link>

      <Link
        className={buttonVariants({
          variant: fav === "true" ? "secondary" : "ghost",
        })}
        href={"/dashboard?fav=true"}
      >
        <div className="max-w-[152px] w-full items-center gap-4 flex">
          <Star className="w-4 h-4" />
          Favourite Boards
        </div>
      </Link>
    </div>
  );
};
