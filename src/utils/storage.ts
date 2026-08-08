export async function getStoredValue<T>(key: string): Promise<T | null> {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures in browser
  }
}

export async function removeStoredValue(key: string): Promise<void> {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage failures in browser
  }
}
