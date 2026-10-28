// Deployed backend URL (set in Netlify); empty locally so the Vite proxy handles /api
export const API_URL = import.meta.env.VITE_API_URL ?? "";

/**fetch helper */
export async function api(
  path,
  { token, body, method = body ? "POST" : "GET" } = {},
) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw Error(await res.text());
  return res.json();
}
