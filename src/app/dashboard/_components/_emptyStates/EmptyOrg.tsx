import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export const EmptyOrg = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
      <Image
        src={"/org.svg"}
        alt="Create Organization Illustration"
        width={200}
        height={200}
      />

      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-700 text-center">
          No Organization Yet!
        </h1>
        <p className="text-zinc-500 text-sm">
          Create an organization to get started
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Create Organization <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0">
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  );
};
