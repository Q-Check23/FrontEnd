import { create } from "zustand";
import type { MyProfile } from "../api/users";

export type BootstrapStatus = "pending" | "authed" | "guest";

interface UserState {
  profile: MyProfile | null;
  accessToken: string | null;
  bootstrapStatus: BootstrapStatus;
  setProfile: (profile: MyProfile) => void;
  setAccessToken: (token: string | null) => void;
  setBootstrapStatus: (status: BootstrapStatus) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  accessToken: null,
  bootstrapStatus: "pending",
  setProfile: (profile) => set({ profile }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setBootstrapStatus: (bootstrapStatus) => set({ bootstrapStatus }),
  clear: () => set({ profile: null, accessToken: null, bootstrapStatus: "guest" }),
}));
