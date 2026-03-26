export class ActionRateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super('Too many requests, please try again later');
    this.name = 'ActionRateLimitError';
  }
}
