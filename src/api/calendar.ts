import { apiRequest } from "./client";

interface CalendarEventResponse {
  eventId: number;
  eventTitle: string | null;
  clubId: number;
  clubName: string | null;
  location: string | null;
  startTime: string | null;
}

interface CalendarClubGroupResponse {
  clubId: number;
  clubName: string | null;
  events: CalendarEventResponse[] | null;
}

export interface CalendarEvent {
  eventId: number;
  eventTitle: string;
  clubId: number;
  clubName: string;
  location: string;
  startTime: string;
}

export interface CalendarClubGroup {
  clubId: number;
  clubName: string;
  events: CalendarEvent[];
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapCalendarEvent(event: CalendarEventResponse): CalendarEvent {
  return {
    eventId: event.eventId,
    eventTitle: normalizeText(event.eventTitle) || `이벤트 ${event.eventId}`,
    clubId: event.clubId,
    clubName: normalizeText(event.clubName) || `클럽 ${event.clubId}`,
    location: normalizeText(event.location),
    startTime: normalizeText(event.startTime),
  };
}

function mapCalendarClubGroup(
  group: CalendarClubGroupResponse,
): CalendarClubGroup {
  return {
    clubId: group.clubId,
    clubName: normalizeText(group.clubName) || `클럽 ${group.clubId}`,
    events: (group.events ?? []).map(mapCalendarEvent),
  };
}

export async function getMonthlyCalendar({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const response = await apiRequest<CalendarClubGroupResponse[]>("/api/calendar", {
    method: "GET",
    auth: { type: "dev-user" },
    query: {
      year,
      month,
    },
  });

  return response.map(mapCalendarClubGroup);
}
