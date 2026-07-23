-- Auto-create user_profiles when a new auth user signs up.
-- Client insert remains as a backup; this prevents null-profile dead ends for demo/review accounts.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  default_name text;
BEGIN
  default_name := NULLIF(
    TRIM(
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(COALESCE(NEW.email, ''), '@', 1)
      )
    ),
    ''
  );

  INSERT INTO public.user_profiles (
    id,
    email,
    display_name,
    streak,
    total_notes,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_name,
    0,
    0,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing auth users missing a row (e.g. demo accounts).
INSERT INTO public.user_profiles (id, email, display_name, streak, total_notes, role)
SELECT
  u.id,
  u.email,
  NULLIF(split_part(COALESCE(u.email, ''), '@', 1), ''),
  0,
  0,
  'user'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;
