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

import { useActions } from "@/store/actions";
import { useMutation } from "convex/react";
import React from "react";
import { api } from "../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useToast } from "@/components/ui/use-toast";

export const DeleteBoardModal = () => {
  const { toast } = useToast();

  const { mutate, isLoading } = useApiMutation(api.board.removeBoard);

  const { deleteOpen, onDeleteClose, boardId } = useActions();

  const onDelete = () => {
    if (!boardId) return;

    mutate({ boardId })
      .then((res: any) => {
        toast({
          title: "Succesfully deleted your board",
        });
        onDeleteClose();
      })
      .catch((e: any) => {
        toast({
          title: "Failed deleting board",
          description: "Please refresh and try again later",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog
      open={deleteOpen}
      onOpenChange={(newState) => {
        if (newState) return;
        onDeleteClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Board</DialogTitle>
          <DialogDescription>
            This will delete your board permanently
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>

          <Button
            onClick={onDelete}
            variant={"destructive"}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
