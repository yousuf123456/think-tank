"use client";
import React, { useEffect, useState } from "react";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";

interface SearchProps {}

export const Search: React.FC<SearchProps> = () => {
  const [q, setQ] = useState("");
  const [debouncedValue] = useDebounceValue(q, 500);

  const router = useRouter();

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/dashboard",
        query: {
          q,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full max-w-lg relative">
      <Input
        value={q}
        className="h-9"
        placeholder="Search boards"
        onChange={(e) => setQ(e.target.value)}
      />

      <SearchIcon className=" absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
    </div>
  );
};
