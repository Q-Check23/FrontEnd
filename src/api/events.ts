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

export type EventFormFieldType = "TEXT" | "SELECT";

export interface CreateEventFormField {
  type: EventFormFieldType;
  label: string;
  required: boolean;
  options: string[];
}

export interface CreateEventRequest {
  clubId: number;
  title: string;
  startTime: string;
  formFields: CreateEventFormField[];
}

export interface UpdateEventRequest {
  title: string;
  startTime: string;
  location: string;
  isActive: boolean;
}

interface EventFormFieldResponse {
  id: number;
  type: EventFormFieldType | null;
  label: string | null;
  required: boolean | null;
  options: string[] | null;
}

interface EventDetailResponse {
  eventId: number;
  clubId: number;
  title: string | null;
  startTime: string | null;
  location: string | null;
  isActive: boolean | null;
  formFields: EventFormFieldResponse[] | null;
}

export interface EventDetail {
  eventId: number;
  clubId: number;
  title: string;
  startTime: string;
  location: string;
  isActive: boolean;
  formFields: Array<{
    id: number;
    type: EventFormFieldType;
    label: string;
    required: boolean;
    options: string[];
  }>;
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

function mapEventDetail(response: EventDetailResponse): EventDetail {
  return {
    eventId: response.eventId,
    clubId: response.clubId,
    title: normalizeText(response.title) || `이벤트 ${response.eventId}`,
    startTime: normalizeText(response.startTime),
    location: normalizeText(response.location),
    isActive: Boolean(response.isActive),
    formFields: (response.formFields ?? []).map((field) => ({
      id: field.id,
      type: field.type === "SELECT" ? "SELECT" : "TEXT",
      label: normalizeText(field.label),
      required: Boolean(field.required),
      options: (field.options ?? [])
        .map((option) => normalizeText(option))
        .filter(Boolean),
    })),
  };
}

export async function getEventDetail(eventId: number) {
  const response = await apiRequest<EventDetailResponse>(`/api/events/${eventId}`, {
    method: "GET",
    auth: { type: "dev-user" },
  });

  return mapEventDetail(response);
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

export async function createEvent(body: CreateEventRequest) {
  const response = await apiRequest<EventDetailResponse>("/api/events", {
    method: "POST",
    auth: { type: "dev-user" },
    body,
  });

  return mapEventDetail(response);
}

export async function updateEvent(eventId: number, body: UpdateEventRequest) {
  const response = await apiRequest<EventDetailResponse>(`/api/events/${eventId}`, {
    method: "PUT",
    auth: { type: "dev-user" },
    body,
  });

  return mapEventDetail(response);
}
