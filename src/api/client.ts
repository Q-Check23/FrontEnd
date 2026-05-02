const DEFAULT_BASE_URL = "http://localhost:8080";
const DEFAULT_DEV_USER_ID = "1";

type QueryPrimitive = string | number | boolean | null | undefined;
type QueryValue = QueryPrimitive | QueryPrimitive[];

export interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  timestamp: string | undefined;

  constructor({
    status,
    code,
    message,
    timestamp,
  }: {
    status: number;
    code: string;
    message: string;
    timestamp?: string;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.timestamp = timestamp;
  }
}

type AuthConfig =
  | { type: "none" }
  | { type: "dev-user" }
  | { type: "bearer"; token: string };

interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  auth?: AuthConfig;
  body?: unknown;
  headers?: HeadersInit;
  query?: Record<string, QueryValue>;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;

const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID ?? DEFAULT_DEV_USER_ID;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, `${API_BASE_URL}/`);

  if (!query) {
    return url.toString();
  }

  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const value of values) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

function isBodyInit(value: unknown): value is BodyInit {
  return (
    typeof value === "string" ||
    value instanceof Blob ||
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof ReadableStream ||
    value instanceof ArrayBuffer
  );
}

function buildHeaders({
  auth,
  headers,
  body,
}: {
  auth: AuthConfig;
  headers: HeadersInit | undefined;
  body: unknown;
}) {
  const finalHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData) && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (body instanceof FormData) {
    finalHeaders.delete("Content-Type");
  }

  if (auth.type === "dev-user") {
    finalHeaders.set("X-USER-ID", DEV_USER_ID);
  }

  if (auth.type === "bearer") {
    finalHeaders.set("Authorization", `Bearer ${auth.token}`);
  }

  return finalHeaders;
}

function serializeBody(body?: unknown) {
  if (body === undefined) {
    return undefined;
  }

  if (isBodyInit(body)) {
    return body;
  }

  return JSON.stringify(body);
}

export async function apiRequest<T>(
  path: string,
  {
    auth = { type: "none" },
    body,
    headers,
    query,
    ...init
  }: ApiRequestOptions = {},
) {
  const requestUrl = buildUrl(path, query);
  const requestBody = serializeBody(body);

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      ...init,
      headers: buildHeaders({ auth, headers, body }),
      ...(requestBody !== undefined ? { body: requestBody } : {}),
    });
  } catch {
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "서버에 연결할 수 없습니다.",
    });
  }

  let envelope: ApiEnvelope<T> | null = null;

  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    envelope = null;
  }

  if (!response.ok) {
    if (envelope) {
      throw new ApiError({
        status: response.status,
        code: envelope.code,
        message: envelope.message,
        timestamp: envelope.timestamp,
      });
    }

    throw new ApiError({
      status: response.status,
      code: "HTTP_ERROR",
      message: `요청에 실패했습니다. (${response.status})`,
    });
  }

  if (!envelope) {
    throw new ApiError({
      status: response.status,
      code: "INVALID_RESPONSE",
      message: "응답 형식을 해석할 수 없습니다.",
    });
  }

  if (!envelope.success) {
    throw new ApiError({
      status: response.status,
      code: envelope.code,
      message: envelope.message,
      timestamp: envelope.timestamp,
    });
  }

  return envelope.data;
}
