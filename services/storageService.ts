export function set_item(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function delete_item(key: string): void {
  localStorage.removeItem(key);
}

export function get_item<T = any>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
