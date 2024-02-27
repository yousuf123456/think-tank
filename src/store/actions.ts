import { create } from "zustand";

interface useActionsType {
  editOpen: boolean;
  deleteOpen: boolean;
  boardId: string | null;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onEditOpen: (id: string) => void;
  onDeleteOpen: (id: string) => void;
}

export const useActions = create<useActionsType>((set) => ({
  boardId: null,
  editOpen: false,
  deleteOpen: false,
  onEditOpen: (id) => set((state) => ({ editOpen: true, boardId: id })),
  onEditClose: () => set((state) => ({ editOpen: false, boardId: null })),
  onDeleteOpen: (id) => set((state) => ({ deleteOpen: true, boardId: id })),
  onDeleteClose: () => set((state) => ({ deleteOpen: false, boardId: null })),
}));
