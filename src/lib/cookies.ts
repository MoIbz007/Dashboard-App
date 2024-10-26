const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

export function setCookie(
  name: string,
  value: string,
  options: { maxAge?: number; path?: string } = {}
): void {
  const { maxAge = COOKIE_MAX_AGE, path = '/' } = options;
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}; max-age=${maxAge}; path=${path}; SameSite=Lax`;
}

export function deleteCookie(name: string, path = '/'): void {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

export function getAllCookies(): Record<string, string> {
  return document.cookie.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    return {
      ...cookies,
      [name]: decodeURIComponent(value),
    };
  }, {} as Record<string, string>);
}

export function clearAllCookies(): void {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach((name) => deleteCookie(name));
}

export function hasCookie(name: string): boolean {
  return getCookie(name) !== undefined;
}

export function updateCookie(
  name: string,
  updater: (value: string) => string
): void {
  const currentValue = getCookie(name);
  if (currentValue !== undefined) {
    const newValue = updater(currentValue);
    setCookie(name, newValue);
  }
}
