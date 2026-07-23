import { withTimeout } from './withTimeout';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type OAuthProvider = 'google' | 'apple';

export type EnabledOAuthProviders = Record<OAuthProvider, boolean>;

export type OAuthProvidersResult = EnabledOAuthProviders & {
  fetchFailed: boolean;
};

let cachedProviders: EnabledOAuthProviders | null = null;

export function clearOAuthProviderCache(): void {
  cachedProviders = null;
}

const EMPTY_PROVIDERS: EnabledOAuthProviders = { google: false, apple: false };
/** On fetch failure, show buttons so Sign in with Apple is not hidden (App Store 4.8). */
const FALLBACK_PROVIDERS: EnabledOAuthProviders = { google: true, apple: true };

export async function getEnabledOAuthProviders(
  forceRefresh = false,
): Promise<OAuthProvidersResult> {
  if (cachedProviders && !forceRefresh) {
    return { ...cachedProviders, fetchFailed: false };
  }

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    return { ...EMPTY_PROVIDERS, fetchFailed: false };
  }

  try {
    const response = await withTimeout(
      fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }),
      12_000,
      'Could not load sign-in options. Please try again.',
    );
    if (!response.ok) {
      if (cachedProviders) {
        return { ...cachedProviders, fetchFailed: true };
      }
      return { ...FALLBACK_PROVIDERS, fetchFailed: true };
    }

    const data = await response.json();
    cachedProviders = {
      google: Boolean(data.external?.google),
      apple: Boolean(data.external?.apple),
    };
    return { ...cachedProviders, fetchFailed: false };
  } catch {
    if (cachedProviders) {
      return { ...cachedProviders, fetchFailed: true };
    }
    return { ...FALLBACK_PROVIDERS, fetchFailed: true };
  }
}

export function getOAuthProviderSetupMessage(provider: OAuthProvider): string {
  if (provider === 'apple') {
    return 'Apple Sign In is not enabled. In Supabase Dashboard → Authentication → Providers, turn on Apple and add your Service ID, Team ID, Key ID, and .p8 secret. See OAUTH_SETUP_GUIDE.md for Apple Developer steps.';
  }
  return 'Google Sign In is not enabled. In Supabase Dashboard → Authentication → Providers, turn on Google and add your OAuth client credentials.';
}
