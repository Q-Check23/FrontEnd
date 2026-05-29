import { useUserStore } from "../stores/useUserStore";

const DEFAULT_BASE_URL = "http://localhost:8080";

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
  requestId: string | undefined;

  constructor({
    status,
    code,
    message,
    timestamp,
    requestId,
  }: {
    status: number;
    code: string;
    message: string;
    timestamp?: string | undefined;
    requestId?: string | undefined;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.timestamp = timestamp;
    this.requestId = requestId;
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
  skipAuthRefresh?: boolean;
}

export const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;
const API_BASE_URL = `${API_ORIGIN}/api`;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

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
    const storeToken = useUserStore.getState().accessToken;
    if (storeToken) {
      finalHeaders.set("Authorization", `Bearer ${storeToken}`);
    }
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

let refreshInflight: Promise<boolean> | null = null;

async function refreshAuthToken(): Promise<boolean> {
  if (refreshInflight) return refreshInflight;

  refreshInflight = (async () => {
    try {
      const data = await apiRequest<{ userId: number; accessToken: string }>(
        "/auth/refresh",
        { method: "POST", skipAuthRefresh: true },
      );
      useUserStore.getState().setAccessToken(data.accessToken);
      return true;
    } catch {
      useUserStore.getState().clear();
      return false;
    } finally {
      refreshInflight = null;
    }
  })();

  return refreshInflight;
}

export async function apiRequest<T>(
  path: string,
  {
    auth = { type: "none" },
    body,
    headers,
    query,
    skipAuthRefresh = false,
    ...init
  }: ApiRequestOptions = {},
): Promise<T> {
  const requestUrl = buildUrl(path, query);
  const requestBody = serializeBody(body);

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      credentials: "include",
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

  if (
    response.status === 401 &&
    auth.type === "dev-user" &&
    !skipAuthRefresh &&
    useUserStore.getState().accessToken !== null
  ) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      const retryOptions: ApiRequestOptions = {
        auth,
        skipAuthRefresh: true,
        ...init,
      };
      if (body !== undefined) retryOptions.body = body;
      if (headers !== undefined) retryOptions.headers = headers;
      if (query !== undefined) retryOptions.query = query;
      return apiRequest<T>(path, retryOptions);
    }
  }

  const requestId = response.headers.get("X-Request-Id") ?? undefined;

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
        requestId,
      });
    }

    throw new ApiError({
      status: response.status,
      code: "HTTP_ERROR",
      message: `요청에 실패했습니다. (${response.status})`,
      requestId,
    });
  }

  if (!envelope) {
    throw new ApiError({
      status: response.status,
      code: "INVALID_RESPONSE",
      message: "응답 형식을 해석할 수 없습니다.",
      requestId,
    });
  }

  if (!envelope.success) {
    throw new ApiError({
      status: response.status,
      code: envelope.code,
      message: envelope.message,
      timestamp: envelope.timestamp,
      requestId,
    });
  }

  return envelope.data;
}
