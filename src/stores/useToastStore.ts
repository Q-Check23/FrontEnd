import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },
}));
