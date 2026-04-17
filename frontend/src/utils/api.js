export const API_BASE_URL = "/api";

export const getSession = () => {
  const rawSession = localStorage.getItem("kia-care-session");

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch (error) {
    localStorage.removeItem("kia-care-session");
    return null;
  }
};

export const saveSession = (user) => {
  localStorage.setItem("kia-care-session", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("kia-care-session");
};

export const fetchJson = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server.");
  }

  return data;
};
