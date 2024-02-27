import React from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import { OrganizationSwitcher } from "@clerk/nextjs";

export const SelectOrg = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
      <Image
        src={"/select-org.svg"}
        alt="Select Organization Illustration"
        width={200}
        height={200}
      />

      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-700 text-center">
          No Organization Selected!
        </h1>
        <p className="text-zinc-500 text-sm">
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
