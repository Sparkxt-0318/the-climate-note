import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimeoutError, withTimeout } from './withTimeout';

describe('withTimeout', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves when the promise settles before the deadline', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 1_000)).resolves.toBe('ok');
  });

  it('rejects with the underlying error when the promise fails first', async () => {
    await expect(
      withTimeout(Promise.reject(new Error('network down')), 1_000),
    ).rejects.toThrow('network down');
  });

  it('rejects with TimeoutError when the promise never settles', async () => {
    vi.useFakeTimers();
    const pending = withTimeout(new Promise(() => undefined), 5_000, 'Timed out');
    const assertion = expect(pending).rejects.toSatisfy(
      (error: unknown) => error instanceof TimeoutError && error.message === 'Timed out',
    );
    await vi.advanceTimersByTimeAsync(5_000);
    await assertion;
  });
});
