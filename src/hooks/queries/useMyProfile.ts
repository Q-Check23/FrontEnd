import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../api/users";
import { mockProfile } from "../../mock/data";
import { useUserStore } from "../../stores/useUserStore";
import { queryKeys } from "../keys";

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      try {
        const profile = await getMyProfile();
        useUserStore.getState().setProfile(profile);
        return profile;
      } catch {
        return mockProfile;
      }
    },
  });
}
