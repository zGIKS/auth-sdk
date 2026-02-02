export class SDKError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SDKError';
  }

  static async fromResponse(response: Response): Promise<SDKError> {
    const text = await response.text();
    let payload: unknown = undefined;

    try {
      payload = text ? JSON.parse(text) : undefined;
    } catch {
      payload = text;
    }

    const body = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {};
    const message = body.message ?? response.statusText ?? 'Unknown error';
    const code = (body.code as string) ?? 'UNKNOWN_ERROR';

    return new SDKError(message as string, code, response.status, body.details);
  }
}

export class NetworkError extends SDKError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}
