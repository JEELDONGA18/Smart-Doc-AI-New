const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Base fetch wrapper with JWT auth.
 * Handles token attachment, JSON parsing, and 401 expiry.
 */
async function request(endpoint, options = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  console.log("API_URL =", API_URL);

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is FormData (file upload), let the browser set Content-Type
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expired — clear auth and redirect
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  // Parse response
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `Request failed (${res.status})`);
  }

  // Some endpoints return no body (204)
  if (res.status === 204) return null;

  return res.json();
}

// Convenience methods

export function get(endpoint) {
  return request(endpoint, { method: "GET" });
}

export function post(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function put(endpoint, data) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}

/**
 * Upload files via FormData.
 * Pass a File object or array of Files.
 */
export function upload(endpoint, files, fieldName = "file") {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((f) => formData.append(fieldName, f));
  } else {
    formData.append(fieldName, files);
  }

  return request(endpoint, {
    method: "POST",
    body: formData,
  });
}
