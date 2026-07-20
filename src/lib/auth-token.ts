const TOKEN_KEY = "routemuse.access-token";
export const AUTH_CHANGED_EVENT = "routemuse:auth-changed";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const clearAccessToken = (): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const subscribeToAuthToken = (onStoreChange: () => void): (() => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange);
  return () => window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange);
};
