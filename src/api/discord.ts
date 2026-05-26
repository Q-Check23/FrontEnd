import { apiRequest } from "./client";

export function getDiscordBotInviteUrl() {
  return apiRequest<string>("/discord/bot-invite-url", {
    method: "GET",
    auth: { type: "dev-user" },
  });
}
