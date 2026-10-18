const API_BASE = "/api";

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Backend endpoint ${endpoint} offline or unreachable:`, err.message);
    return null;
  }
}

export const api = {
  login: (email, password) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getDashboard: () => fetchApi("/dashboard"),
  getCameras: () => fetchApi("/cameras"),
  getCamera: (id) => fetchApi(`/cameras/${id}`),
  getDetection: () => fetchApi("/detection"),
  getAlerts: () => fetchApi("/alerts"),
  getAlert: (id) => fetchApi(`/alerts/${id}`),
  updateAlertStatus: (id, status) => fetchApi(`/alerts/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getIncidents: () => fetchApi("/incidents"),
  getIncident: (id) => fetchApi(`/incidents/${id}`),
  getSiteMap: () => fetchApi("/site/map"),
  getAnalytics: () => fetchApi("/analytics"),
  getSettings: () => fetchApi("/settings"),
  updateSettings: (settings) => fetchApi("/settings", { method: "PUT", body: JSON.stringify(settings) })
};
