import { apiRequest } from "./client";

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  authorName: string;
  authorRole: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface NoticeResponse {
  noticeId: number;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
}

export interface UpdateNoticeRequest {
  clubId: number;
  noticeId: number;
  title: string;
  content: string;
}

export function getNotices(clubId: number) {
  return apiRequest<Notice[]>(`/clubs/${clubId}/notices`, {
    method: "GET",
    auth: { type: "dev-user" },
  });
}

export function createNotice(clubId: number, body: CreateNoticeRequest) {
  return apiRequest<NoticeResponse>(`/clubs/${clubId}/notices`, {
    method: "POST",
    auth: { type: "dev-user" },
    body,
  });
}

export function updateNotice(body: UpdateNoticeRequest) {
  return apiRequest<void>(
    `/clubs/${body.clubId}/notices/${body.noticeId}`,
    {
      method: "PUT",
      auth: { type: "dev-user" },
      body: { title: body.title, content: body.content },
    },
  );
}

export function deleteNotice(clubId: number, noticeId: number) {
  return apiRequest<void>(`/clubs/${clubId}/notices/${noticeId}`, {
    method: "DELETE",
    auth: { type: "dev-user" },
  });
}
