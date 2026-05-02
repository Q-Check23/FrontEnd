import { apiRequest } from "./client";

interface CheckInResponse {
  registrationId: number;
  checkInTime: string | null;
  username: string | null;
}

export interface AttendanceCheckInResult {
  registrationId: number;
  checkInTime: string;
  username: string;
}

export interface AttendanceCheckInRequest {
  qrToken: string;
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapCheckInResponse(response: CheckInResponse): AttendanceCheckInResult {
  return {
    registrationId: response.registrationId,
    checkInTime: normalizeText(response.checkInTime),
    username: normalizeText(response.username) || "이름 없음",
  };
}

export async function checkInAttendance(body: AttendanceCheckInRequest) {
  const response = await apiRequest<CheckInResponse>("/api/attendance/check-in", {
    method: "POST",
    auth: { type: "dev-user" },
    body,
  });

  return mapCheckInResponse(response);
}
