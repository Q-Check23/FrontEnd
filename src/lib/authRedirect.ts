const AUTH_NEXT_STORAGE_KEY = "qcheck:auth-next";

export function setAuthNext(path: string) {
  if (!path || path.startsWith("/landing") || path.startsWith("/login")) {
    return;
  }
  sessionStorage.setItem(AUTH_NEXT_STORAGE_KEY, path);
}

export function consumeAuthNext(): string | null {
  const next = sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  if (next) {
    sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
  }
  return next;
}
