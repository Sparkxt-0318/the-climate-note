import { supabase } from './supabase';
import { withTimeout } from './withTimeout';

const DELETE_ACCOUNT_TIMEOUT_MS = 30_000;

export async function permanentlyDeleteAccount(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('You must be signed in to delete your account.');
  }

  const { data, error } = await withTimeout(
    supabase.functions.invoke('delete-account', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }),
    DELETE_ACCOUNT_TIMEOUT_MS,
    'Account deletion timed out. Please check your connection and try again.',
  );

  if (error) throw error;
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }

  await supabase.auth.signOut();
}
