import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import React from "react";
import { Search } from "./Search";
import { InviteMembers } from "./_sidebars/InviteMembers";

export const Navbar = () => {
  return (
    <div className="bg-white px-3 sm:px-6 lg:px-12 py-3 flex items-center gap-6 sticky top-0 left-0 z-50">
      <div className="hidden lg:flex lg:flex-1">
        <Search />
      </div>

      <div className="lg:hidden flex flex-1">
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "max-w-[324px] w-full",
              organizationSwitcherTrigger:
                "w-full px-3 py-1 justify-between bg-zinc-50",
            },
          }}
        />
      </div>

      <div className="lg:hidden block ">
        <InviteMembers />
      </div>

      <UserButton />
    </div>
  );
};
