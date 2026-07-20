export const getSafeRedirect = (
  value: string | null | undefined,
  fallback = "/dashboard",
): string =>
  value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
