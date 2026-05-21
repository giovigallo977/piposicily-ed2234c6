
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 2. Backfill admin role for designated emails
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) IN ('pipoesplora@gmail.com','alessandro.borzi94@gmail.com','seeletrasforma@gmail.com')
ON CONFLICT DO NOTHING;

-- 3. Update handle_new_user to assign admin role automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email) VALUES (NEW.id, NEW.email);
  IF lower(NEW.email) IN ('pipoesplora@gmail.com','alessandro.borzi94@gmail.com','seeletrasforma@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Replace write policies on content tables with admin-only
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname='public'
    AND tablename IN ('hotspots','free_spots','free_spot_categories','site_content','style_settings')
    AND cmd IN ('INSERT','UPDATE','DELETE')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Hotspots
CREATE POLICY "Admins manage hotspots ins" ON public.hotspots FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage hotspots upd" ON public.hotspots FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage hotspots del" ON public.hotspots FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Free spots
CREATE POLICY "Admins manage free_spots ins" ON public.free_spots FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage free_spots upd" ON public.free_spots FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage free_spots del" ON public.free_spots FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Free spot categories
CREATE POLICY "Admins manage fsc ins" ON public.free_spot_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage fsc upd" ON public.free_spot_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage fsc del" ON public.free_spot_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Site content
CREATE POLICY "Admins manage site_content ins" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage site_content upd" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage site_content del" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Style settings
CREATE POLICY "Admins manage style_settings ins" ON public.style_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage style_settings upd" ON public.style_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 5. Profiles: prevent self-grant premium
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND is_premium = (SELECT p.is_premium FROM public.profiles p WHERE p.user_id = auth.uid())
    AND premium_since IS NOT DISTINCT FROM (SELECT p.premium_since FROM public.profiles p WHERE p.user_id = auth.uid())
    AND stripe_session_id IS NOT DISTINCT FROM (SELECT p.stripe_session_id FROM public.profiles p WHERE p.user_id = auth.uid())
  );

-- 6. Storage: admin-only writes; drop the broad listing SELECT (direct URLs still work because bucket is public)
DROP POLICY IF EXISTS "Hotspot images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hotspot images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hotspot images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hotspot images" ON storage.objects;

CREATE POLICY "Admins upload hotspot images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hotspot-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update hotspot images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'hotspot-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete hotspot images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'hotspot-images' AND public.has_role(auth.uid(),'admin'));
