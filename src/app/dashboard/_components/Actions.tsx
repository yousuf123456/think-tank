import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/confg";
import { useActions } from "@/store/actions";
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface ActionsProps {
  boardId: string;
  children: React.ReactNode;
}

export const Actions = ({ boardId, children }: ActionsProps) => {
  const { onEditOpen, onDeleteOpen } = useActions();

  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}/boards/${boardId}`);
    toast({
      title: "Copied to clipboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onCopy()}>
          <Copy className="w-4 h-4 text-zinc-600 mr-2" />
          Copy board link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEditOpen(boardId)}>
          <Pencil className="w-4 h-4 text-zinc-600 mr-2" />
          Edit Board Name
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDeleteOpen(boardId);
          }}
        >
          <Trash2 className="w-4 h-4 text-zinc-600 mr-2" />
          Delete Board
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
