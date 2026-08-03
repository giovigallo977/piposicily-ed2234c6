REVOKE INSERT, DELETE ON public.profiles FROM authenticated;
REVOKE INSERT, DELETE ON public.profiles FROM anon;
GRANT ALL ON public.profiles TO service_role;