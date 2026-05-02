import { apiRequest } from "./client";

interface EventSummaryResponse {
  eventId: number;
  title: string | null;
  startTime: string | null;
  location: string | null;
  isActive: boolean | null;
}

interface EventListResponse {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  items: EventSummaryResponse[];
}

export interface EventSummary {
  eventId: number;
  title: string;
  startTime: string;
  location: string;
  isActive: boolean;
}

export interface EventListPage {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  items: EventSummary[];
}

export interface ListEventsParams {
  page?: number;
  size?: number;
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapEventSummary(event: EventSummaryResponse): EventSummary {
  return {
    eventId: event.eventId,
    title: normalizeText(event.title) || `이벤트 ${event.eventId}`,
    startTime: normalizeText(event.startTime),
    location: normalizeText(event.location),
    isActive: Boolean(event.isActive),
  };
}

export async function getEvents({
  page = 0,
  size = 10,
}: ListEventsParams = {}) {
  const response = await apiRequest<EventListResponse>("/api/events", {
    method: "GET",
    auth: { type: "dev-user" },
    query: {
      page,
      size,
    },
  });

  return {
    page: response.page,
    size: response.size,
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    items: response.items.map(mapEventSummary),
  } satisfies EventListPage;
}
