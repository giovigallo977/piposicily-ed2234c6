CREATE TABLE public.granted_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.granted_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can select" ON public.granted_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert" ON public.granted_emails FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete" ON public.granted_emails FOR DELETE TO authenticated USING (true);