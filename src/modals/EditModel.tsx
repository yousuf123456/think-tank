import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useActions } from "@/store/actions";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

export const EditModel = () => {
  const [title, setTitle] = useState("");
  const { editOpen, onEditClose, boardId } = useActions();

  const { mutate, isLoading } = useApiMutation(api.board.updateBoard);

  const { toast } = useToast();

  const onEdit = () => {
    if (!title || !title.length) {
      document.getElementById("newTitleInput")?.focus();
      return;
    }

    mutate({ boardId, title })
      .then((res: any) => {
        toast({
          title: "Updated the board title",
        });
        onEditClose();
      })
      .catch((e: any) => {
        toast({
          title: "Error updating the board title",
          description: "Please refresh and try again later.",
        });
      });
  };

  return (
    <Dialog
      open={editOpen}
      onOpenChange={(newState) => {
        onEditClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Name</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1 mt-4">
          <p className="text-sm text-zinc-600">Board Name</p>
          <Input
            value={title}
            id="newTitleInput"
            disabled={isLoading}
            placeholder="Enter new board name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>

          <Button
            onClick={onEdit}
            disabled={isLoading}
            className="bg-secondary-foreground hover:bg-secondary-foreground/90"
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
