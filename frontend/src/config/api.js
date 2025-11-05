export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function httpGet(path) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { status, payload }
}
