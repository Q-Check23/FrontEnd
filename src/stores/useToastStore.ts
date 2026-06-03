import { create } from "zustand";

export type ToastVariant = "info" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, variant?: ToastVariant) => void;
}

const TOAST_DURATION_MS = 3500;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, TOAST_DURATION_MS);
  },
}));
