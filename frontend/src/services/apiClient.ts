export interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    // Check if import.meta.env is defined (Vite environment)
    const envUrl = typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_API_URL
      : null;

    this.baseUrl = envUrl || 'http://localhost:3001';
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = 5000, ...fetchOptions } = options;
    const url = `${this.baseUrl}${path}`;

    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeout);

    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timerId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      clearTimeout(timerId);
      if (error.name === 'AbortError') {
        throw new Error('Request Timeout: The server did not respond in time.');
      }
      throw error;
    }
  }

  async post<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();
