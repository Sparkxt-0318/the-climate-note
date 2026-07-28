import { beforeEach, describe, expect, it, vi } from 'vitest';

const { isNativePlatform, browserOpen, browserClose, browserAddListener } = vi.hoisted(() => ({
  isNativePlatform: vi.fn(() => true),
  browserOpen: vi.fn(async () => undefined),
  browserClose: vi.fn(async () => undefined),
  browserAddListener: vi.fn(async () => ({ remove: vi.fn() })),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => isNativePlatform(),
  },
}));

vi.mock('@capacitor/browser', () => ({
  Browser: {
    open: browserOpen,
    close: browserClose,
    addListener: browserAddListener,
  },
}));

describe('openInAppOAuth', () => {
  beforeEach(() => {
    vi.resetModules();
    isNativePlatform.mockReset();
    browserOpen.mockReset();
    browserClose.mockReset();
    browserAddListener.mockReset();
    browserOpen.mockResolvedValue(undefined);
    browserClose.mockResolvedValue(undefined);
    browserAddListener.mockResolvedValue({ remove: vi.fn() });
  });

  it('uses Capacitor Browser (SFSafariViewController) on native — never window.location', async () => {
    isNativePlatform.mockReturnValue(true);
    const hrefSpy = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, href: '' },
    });
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      set: hrefSpy,
      get: () => '',
    });

    const { openInAppOAuth } = await import('./nativeOAuth');
    await openInAppOAuth('https://example.com/oauth');

    expect(browserOpen).toHaveBeenCalledWith({
      url: 'https://example.com/oauth',
      presentationStyle: 'fullscreen',
      toolbarColor: '#eef2ec',
    });
    expect(hrefSpy).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('navigates via window.location on web only', async () => {
    isNativePlatform.mockReturnValue(false);
    const original = window.location;
    let assigned = '';
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...original,
        get href() {
          return assigned;
        },
        set href(value: string) {
          assigned = value;
        },
      },
    });

    const { openInAppOAuth } = await import('./nativeOAuth');
    await openInAppOAuth('https://example.com/oauth');

    expect(browserOpen).not.toHaveBeenCalled();
    expect(assigned).toBe('https://example.com/oauth');

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('rejects on Browser.open failure without navigating away', async () => {
    isNativePlatform.mockReturnValue(true);
    browserOpen.mockRejectedValue(new Error('Browser unavailable'));
    const hrefSpy = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, href: '' },
    });
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      set: hrefSpy,
      get: () => '',
    });

    const { openInAppOAuth } = await import('./nativeOAuth');
    await expect(openInAppOAuth('https://example.com/oauth')).rejects.toThrow(
      'Browser unavailable',
    );
    expect(hrefSpy).not.toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });
});
