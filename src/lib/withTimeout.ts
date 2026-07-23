export class TimeoutError extends Error {
  constructor(message = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/** Race a promise against a timeout so UI loading states always settle. */
export function withTimeout<T>(
  promise: Promise<T>,
  ms = 15_000,
  message = 'Request timed out. Please try again.',
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
