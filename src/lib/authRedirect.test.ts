import { beforeEach, describe, expect, it, vi } from 'vitest';

const { isNativePlatform } = vi.hoisted(() => ({
  isNativePlatform: vi.fn(() => true),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => isNativePlatform(),
  },
}));

describe('getAuthRedirectUrl', () => {
  beforeEach(() => {
    vi.resetModules();
    isNativePlatform.mockReset();
  });

  it('returns the native custom URL scheme callback on iOS/Android', async () => {
    isNativePlatform.mockReturnValue(true);
    const { getAuthRedirectUrl } = await import('./authRedirect');
    expect(getAuthRedirectUrl()).toBe('com.theclimatenote.app://auth/callback');
    expect(getAuthRedirectUrl('/auth/reset-password')).toBe(
      'com.theclimatenote.app://auth/reset-password',
    );
  });

  it('uses the current origin on web', async () => {
    isNativePlatform.mockReturnValue(false);
    const { getAuthRedirectUrl } = await import('./authRedirect');
    expect(getAuthRedirectUrl()).toBe(window.location.origin);
    expect(getAuthRedirectUrl('/reset-password')).toBe(
      `${window.location.origin}/reset-password`,
    );
  });
});
