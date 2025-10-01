const LOCAL_DEV_PORTS = new Set(["3000", "5173", "4173"]);
const origin = window.location.origin;
const defaultApiHost = LOCAL_DEV_PORTS.has(window.location.port)
  ? "http://localhost:4000"
  : origin;

export const API_BASE_URL =
  (window.__APP_CONFIG__?.apiBaseUrl && window.__APP_CONFIG__.apiBaseUrl.trim()) ||
  defaultApiHost;

