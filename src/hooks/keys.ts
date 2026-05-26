export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (params?: { page?: number; size?: number }) =>
      [...queryKeys.events.all, "list", params] as const,
    detail: (eventId: number) =>
      [...queryKeys.events.all, "detail", eventId] as const,
    registrations: (eventId: number) =>
      [...queryKeys.events.all, eventId, "registrations"] as const,
  },
  calendar: {
    monthly: ({ year, month }: { year: number; month: number }) =>
      ["calendar", "monthly", { year, month }] as const,
    search: (query: string) => ["calendar", "search", query] as const,
    filter: (params: {
      startDate?: string;
      endDate?: string;
      eventName?: string;
      clubName?: string;
    }) => ["calendar", "filter", params] as const,
  },
  clubs: {
    my: () => ["clubs", "my"] as const,
    members: (clubId: number) => ["clubs", clubId, "members"] as const,
  },
  notices: {
    list: (clubId: number) => ["notices", clubId] as const,
  },
  users: {
    me: () => ["users", "me"] as const,
  },
  discord: {
    botInviteUrl: () => ["discord", "bot-invite-url"] as const,
  },
};
