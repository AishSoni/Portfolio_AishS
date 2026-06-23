import axios, { type AxiosInstance } from "axios";

export interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/** Generic axios factory — no service-specific env or auth. */
export function createHttpClient(config: HttpClientConfig): AxiosInstance {
  return axios.create({
    baseURL: config.baseURL,
    headers: config.headers,
    timeout: config.timeoutMs ?? 10_000,
  });
}

/** Same-origin client for portfolio API routes. */
export const portfolioClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});
