const DEFAULT_API_BASE_URL = 'http://localhost:4000';

export const API_BASE_URL =
  (window.__APP_CONFIG__?.apiBaseUrl && window.__APP_CONFIG__.apiBaseUrl.trim()) ||
  DEFAULT_API_BASE_URL;

