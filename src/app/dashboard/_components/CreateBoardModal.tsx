"use client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateBoardModalProps {
  children: React.ReactNode;
  orgId: string;
}

export const CreateBoardModal = ({
  orgId,
  children,
}: CreateBoardModalProps) => {
  const [title, setTitle] = useState("Untitled");

  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const mutate = useMutation(api.board.createBoard);

  const onCreate = () => {
    if (!title || !title.length) {
      document.getElementById("titleInput")?.focus();
      return;
    }
    if (!orgId) return;

    setIsLoading(true);

    mutate({ orgId, title })
      .then((res) => {
        toast({
          title: "Succesfully created a new board",
        });
      })
      .catch((e) =>
        toast({
          title: "Failed creating a new board",
          description: "Please refresh and try again",
          variant: "destructive",
        })
      )
      .finally(() => {
        setIsLoading(false);
        setOpen(false);
      });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newState) => {
        if (isLoading) return;
        setOpen(newState);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 mt-4">
          <p className="text-sm text-zinc-600">Board Name</p>
          <Input
            value={title}
            id="titleInput"
            placeholder="Enter board name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-5">
          <DialogClose asChild disabled={isLoading}>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={onCreate}
            disabled={isLoading}
            className=" bg-secondary-foreground hover:bg-secondary-foreground/90"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
