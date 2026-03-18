export function pickFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function toInternalPath(
  url: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!url) {
    return fallback;
  }

  if (url.startsWith("/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const relativePath = `${parsed.pathname}${parsed.search}${parsed.hash}`;

    return relativePath.startsWith("/") ? relativePath : fallback;
  } catch {
    return fallback;
  }
}

export function getSafeCallbackUrl(
  value: string | string[] | undefined,
  fallback = "/dashboard",
) {
  return toInternalPath(pickFirstValue(value), fallback);
}
