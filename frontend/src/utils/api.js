export const API_BASE_URL = "http://localhost:3000/api";

// ======================
// SESSION HANDLING
// ======================

export const getSession = () => {
  const rawSession = localStorage.getItem("kia-care-session");

  if (!rawSession) return null;

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

// ======================
// FETCH WRAPPER (FIXED)
// ======================

export const fetchJson = async (endpoint, options = {}) => {
  try {
    // 🔥 pastikan endpoint selalu benar formatnya
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

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
  } catch (error) {
    throw error;
  }
};