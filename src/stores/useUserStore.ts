import { create } from "zustand";
import type { MyProfile } from "../api/users";

interface UserState {
  profile: MyProfile | null;
  setProfile: (profile: MyProfile) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
