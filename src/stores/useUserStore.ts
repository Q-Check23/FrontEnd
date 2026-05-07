import { create } from "zustand";
import type { MyProfile } from "../api/users";

interface UserState {
  profile: MyProfile | null;
  accessToken: string | null;
  setProfile: (profile: MyProfile) => void;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  accessToken: null,
  setProfile: (profile) => set({ profile }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ profile: null, accessToken: null }),
}));
