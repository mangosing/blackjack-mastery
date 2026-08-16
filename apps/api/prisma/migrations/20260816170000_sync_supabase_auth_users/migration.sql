-- Create a public user whenever Supabase Auth creates an auth user.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public."User" (
        "id",
        "supabaseUserId",
        "displayName",
        "avatarUrl",
        "createdAt",
        "updatedAt"
    )
    VALUES (
        gen_random_uuid()::text,
        NEW.id::text,
        COALESCE(
            NEW.raw_user_meta_data ->> 'display_name',
            NEW.raw_user_meta_data ->> 'full_name'
        ),
        NEW.raw_user_meta_data ->> 'avatar_url',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT ("supabaseUserId") DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user();
