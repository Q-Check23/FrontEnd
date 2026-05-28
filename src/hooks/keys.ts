export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (params?: { page?: number; size?: number; clubId?: number }) =>
      [...queryKeys.events.all, "list", params] as const,
    detail: (eventId: number) =>
      [...queryKeys.events.all, "detail", eventId] as const,
    registrations: (eventId: number) =>
      [...queryKeys.events.all, eventId, "registrations"] as const,
    myRegistration: (eventId: number) =>
      [...queryKeys.events.all, eventId, "my-registration"] as const,
  },
  calendar: {
    all: ["calendar"] as const,
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
    detail: (clubId: number) => ["clubs", "detail", clubId] as const,
    members: (clubId: number) => ["clubs", clubId, "members"] as const,
  },
  notices: {
    list: (clubId: number) => ["notices", clubId] as const,
  },
  users: {
    me: () => ["users", "me"] as const,
    stats: () => ["users", "me", "stats"] as const,
  },
  discord: {
    botInviteUrl: () => ["discord", "bot-invite-url"] as const,
  },
};
