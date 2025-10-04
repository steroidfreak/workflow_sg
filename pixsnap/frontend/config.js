const LOCAL_DEV_PORTS = new Set(["3000", "5173", "4173"]);

const hasWindow = typeof window !== 'undefined';
const origin = hasWindow ? window.location.origin : 'http://localhost:4000';
const defaultApiHost = hasWindow && LOCAL_DEV_PORTS.has(window.location.port)
  ? 'http://localhost:4000'
  : origin;

const envApiBase =
  typeof process !== 'undefined' && process.env?.API_BASE_URL
    ? process.env.API_BASE_URL.trim()
    : '';

export const API_BASE_URL = hasWindow
  ? (window.__APP_CONFIG__?.apiBaseUrl?.trim() || defaultApiHost)
  : envApiBase || defaultApiHost;
