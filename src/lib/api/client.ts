import type { ZodType, ZodTypeDef } from 'zod';
import { env } from '@/config/env';

/** Error shape thrown by every service (mock and HTTP) so the UI handles both the same way. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code = 'UNKNOWN', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type AuthTokenProvider = () => string | null | Promise<string | null>;
let authTokenProvider: AuthTokenProvider = () => null;

/** Hook for later: register a function that returns the current auth token (JWT, session…). */
export function setAuthTokenProvider(provider: AuthTokenProvider): void {
  authTokenProvider = provider;
}

type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
  /** Optional zod schema; the response is validated and typed through it. */
  schema?: ZodType<T, ZodTypeDef, unknown>;
  baseUrl?: string;
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>): string {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  const qs = params.toString();
  return `${baseUrl}${path}${qs ? `?${qs}` : ''}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { method = 'GET', body, query, signal, schema, baseUrl = env.apiUrl } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = await authTokenProvider();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(baseUrl, path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError('Network error — please check your connection and try again.', 0, 'NETWORK');
  }

  const text = await response.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError('Invalid server response.', response.status, 'INVALID_JSON');
    }
  }

  if (!response.ok) {
    const payload = (data ?? {}) as { message?: string; code?: string; details?: unknown };
    throw new ApiError(
      payload.message ?? `Request failed (${response.status})`,
      response.status,
      payload.code ?? 'HTTP_ERROR',
      payload.details,
    );
  }

  if (schema) {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError(
        'Unexpected server response.',
        response.status,
        'INVALID_RESPONSE',
        parsed.error.issues,
      );
    }
    return parsed.data;
  }
  return data as T;
}

export const apiClient = {
  get: <T>(path: string, opts?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...opts, method: 'PUT', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...opts, method: 'DELETE' }),
};
