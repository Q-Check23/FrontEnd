import { useQuery } from "@tanstack/react-query";
import { getDiscordBotInviteUrl } from "../../api/discord";
import { queryKeys } from "../keys";

export function useDiscordBotInviteUrl() {
  return useQuery({
    queryKey: queryKeys.discord.botInviteUrl(),
    queryFn: () => getDiscordBotInviteUrl(),
    retry: false,
  });
}
