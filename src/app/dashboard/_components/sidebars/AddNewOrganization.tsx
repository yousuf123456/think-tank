"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const AddNewOrganization = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="pl-4 pr-3">
          <Button
            size={"sm"}
            aria-label="add new organization"
            className="w-10 h-10 bg-slate-600 hover:bg-slate-700 transition"
          >
            <Plus className="text-white w-5 h-5" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
