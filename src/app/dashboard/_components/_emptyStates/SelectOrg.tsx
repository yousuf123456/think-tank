import React from "react";

import Image from "next/image";
import { OrganizationSwitcher } from "@clerk/nextjs";

export const SelectOrg = () => {
  return (
    <div className="w-full mt-20 flex flex-col gap-8 justify-center items-center">
      <Image
        src={"/org.svg"}
        alt="Select Organization Illustration"
        width={200}
        height={200}
      />

      <div className="flex items-center flex-col">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-700 text-center">
          No Organization Selected!
        </h1>
        <p className="text-zinc-500 text-base">
          Choose an organization to get started
        </p>
      </div>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: "max-w-[324px] w-full",
            organizationSwitcherTrigger:
              "w-full px-4 py-2 justify-between bg-zinc-50",
          },
        }}
      />
    </div>
  );
};
