const fallbackApiBaseUrl = "http://localhost:3000/api";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, "");

export const fetchJson = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server.");
  }

  return data;
};
