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
  description: string;
  startTime: string;
  location?: string;
  createDiscordChannel?: boolean;
  discordChannelId?: string;
  formFields: CreateEventFormField[];
}

export interface UpdateEventRequest {
  title: string;
  description: string;
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
  description: string | null;
  startTime: string | null;
  location: string | null;
  discordChannelId: string | null;
  isActive: boolean | null;
  formFields: EventFormFieldResponse[] | null;
}

export interface EventDetail {
  eventId: number;
  clubId: number;
  title: string;
  description: string;
  startTime: string;
  location: string;
  discordChannelId: string;
  isActive: boolean;
  formFields: Array<{
    id: number;
    type: EventFormFieldType;
    label: string;
    required: boolean;
    options: string[];
  }>;
}

interface RegistrationAnswerResponse {
  fieldId: number;
  label: string | null;
  value: string | null;
}

interface EventRegistrationResponse {
  registrationId: number;
  userId: number;
  username: string | null;
  status: string | null;
  qrToken: string | null;
  answers: RegistrationAnswerResponse[] | null;
}

export interface EventRegistration {
  registrationId: number;
  userId: number;
  username: string;
  status: string;
  qrToken: string;
  answers: Array<{
    fieldId: number;
    label: string;
    value: string;
  }>;
}

interface MyEventRegistrationResponse {
  registrationId: number;
  qrToken: string | null;
  status: string | null;
  createdAt: string | null;
  answers: RegistrationAnswerResponse[] | null;
}

interface CreateEventRegistrationResponse {
  registrationId: number;
  qrToken: string | null;
}

export interface CreateEventRegistrationRequest {
  answers: Array<{
    fieldId: number;
    value: string;
  }>;
}

export interface CreatedEventRegistration {
  registrationId: number;
  qrToken: string;
}

export interface MyEventRegistration {
  registrationId: number;
  qrToken: string;
  status: string;
  createdAt: string;
  answers: Array<{
    fieldId: number;
    label: string;
    value: string;
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
    description: normalizeText(response.description),
    startTime: normalizeText(response.startTime),
    location: normalizeText(response.location),
    discordChannelId: normalizeText(response.discordChannelId),
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

function mapAnswer(answer: RegistrationAnswerResponse) {
  return {
    fieldId: answer.fieldId,
    label: normalizeText(answer.label) || `질문 ${answer.fieldId}`,
    value: normalizeText(answer.value),
  };
}

function mapEventRegistration(
  registration: EventRegistrationResponse,
): EventRegistration {
  return {
    registrationId: registration.registrationId,
    userId: registration.userId,
    username:
      normalizeText(registration.username) || `user-${registration.userId}`,
    status: normalizeText(registration.status) || "UNKNOWN",
    qrToken: normalizeText(registration.qrToken),
    answers: (registration.answers ?? []).map(mapAnswer),
  };
}

function mapMyEventRegistration(
  registration: MyEventRegistrationResponse,
): MyEventRegistration {
  return {
    registrationId: registration.registrationId,
    qrToken: normalizeText(registration.qrToken),
    status: normalizeText(registration.status) || "UNKNOWN",
    createdAt: normalizeText(registration.createdAt),
    answers: (registration.answers ?? []).map(mapAnswer),
  };
}

export async function getEventDetail(eventId: number) {
  const response = await apiRequest<EventDetailResponse>(`/events/${eventId}`, {
    method: "GET",
    auth: { type: "dev-user" },
  });

  return mapEventDetail(response);
}

export async function getEvents({
  page = 0,
  size = 10,
}: ListEventsParams = {}) {
  const response = await apiRequest<EventListResponse>("/events", {
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
  const response = await apiRequest<EventDetailResponse>("/events", {
    method: "POST",
    auth: { type: "dev-user" },
    body,
  });

  return mapEventDetail(response);
}

export async function updateEvent(eventId: number, body: UpdateEventRequest) {
  const response = await apiRequest<EventDetailResponse>(`/events/${eventId}`, {
    method: "PUT",
    auth: { type: "dev-user" },
    body,
  });

  return mapEventDetail(response);
}

export async function getEventRegistrations(eventId: number) {
  const response = await apiRequest<EventRegistrationResponse[]>(
    `/events/${eventId}/registrations`,
    {
      method: "GET",
      auth: { type: "dev-user" },
    },
  );

  return response.map(mapEventRegistration);
}

export async function getMyEventRegistration(eventId: number) {
  const response = await apiRequest<MyEventRegistrationResponse>(
    `/events/${eventId}/registrations/me`,
    {
      method: "GET",
      auth: { type: "dev-user" },
    },
  );

  return mapMyEventRegistration(response);
}

export async function createEventRegistration(
  eventId: number,
  body: CreateEventRegistrationRequest,
) {
  const response = await apiRequest<CreateEventRegistrationResponse>(
    `/events/${eventId}/registrations`,
    {
      method: "POST",
      auth: { type: "dev-user" },
      body,
    },
  );

  return {
    registrationId: response.registrationId,
    qrToken: normalizeText(response.qrToken),
  } satisfies CreatedEventRegistration;
}
