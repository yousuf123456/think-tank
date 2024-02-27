"use client";
import React from "react";

import { OrganizationProfile, useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, SmilePlus } from "lucide-react";

export const InviteMembers = () => {
  const data = useOrganization();

  if (!data) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="text-zinc-700 text-base">
          <Plus className="w-4 h-4 text-zinc-700 mr-2" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent max-w-4xl">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
